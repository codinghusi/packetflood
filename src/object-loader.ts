import Events from 'events';
import { Engine, engineSymbol } from './engine';
import { loadResource, Resource } from "./resource-loader";
import { KeyValue, mapObject } from './utils';
import * as PIXI from 'pixi.js';

// Fix for Snowpack
const { EventEmitter } = Events;
type EventEmitter = typeof EventEmitter;

export async function loadResourcesFromJSON(path: string) {
    const response = await fetch(path);
    const json = await response.json();
    const rawObjects = json.objects;
    const resourcePromises = Object.values(rawObjects)
        .map((object: any) => loadResource(object.id, object.group, object, object.path));
    const resourceList = await Promise.all(resourcePromises);
    const resources = resourceList.reduce((acc, resource: Resource) => {
        acc[resource.name] = resource;
        return acc;
    }, {} as any);
    return resources;
}

function EmitChanges(eventName = 'property-change'): PropertyDecorator {
    return (target: any, key: string|symbol) => {
        Object.defineProperty(target, key, {
            set(afterValue: any) {
                const beforeValue = (target as any)[key];
                target.emit(eventName, {
                    target,
                    key,
                    beforeValue,
                    afterValue,
                });
            }
        })
    }
}


export namespace Event {
    export const symbol = Symbol('events');
    export type EventHandler<T extends GameObject> = (target: T) => void;
    // FIXME: typing any to EventEmitter (currently fails)
    function eventHandler<T extends GameObject>(eventEmitter: (target: T) => any, eventName: string) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const setMyEvent = (target: T) => eventEmitter(target).on(eventName, () => (target as any)[propertyKey].call(target));
            const eventHandlers = Reflect.getMetadata(symbol, target) ?? [];
            eventHandlers.push(setMyEvent);
            Reflect.defineMetadata(symbol, eventHandlers, target);
        }
    }
    
    export const Init = eventHandler(target => target.events, 'init');
    export const Tick = eventHandler(target => target.engine, 'tick');
    
    export function On(eventName: string) {
        return eventHandler(target => target.events, eventName);
    }
}

export class ObjectLight {
    blurFilter = new PIXI.filters.BlurFilter();

    get intensity() {
        return this.blurFilter.blur;
    }

    set intensity(value: number) {
        this.blurFilter.blur = value;
    }

    get enabled() {
        return this.sprite.visible;
    }

    set enabled(value: boolean) {
        this.sprite.visible = value;
    }

    constructor(public sprite: PIXI.Sprite,
                intensity: number,
                enabled: boolean) {
        this.sprite.filters = [ this.blurFilter ];
        this.intensity = intensity;
        this.enabled = enabled;
    }
}

export abstract class GameObject extends PIXI.Container {
    // TODO: checkout PIXI.Sprite.children
    protected sprites: KeyValue<PIXI.Sprite> = {}
    public engine: Engine;
    protected data: any;
    public events = new EventEmitter();
    protected lighting: ObjectLight;


    constructor(public id: string) {  
        super();

        // Get all sprites and data together
        this.engine = Reflect.getMetadata(engineSymbol, this.constructor) as Engine;
        const resource = this.engine.getResource(this.id);
        this.data = resource.data;
        this.sprites = mapObject(resource.textures, (name, texture) => {
            return new PIXI.Sprite(texture);
        });

        // Add all Sprites to this container
        Object.values(this.sprites).forEach(sprite => this.addChild(sprite));
        this.engine.app.stage.addChild(this);

        // Handle lights
        if (this.sprites.light) {
            this.lighting = new ObjectLight(this.sprites.light, 5, false);
        }

        // Apply all events
        const eventHandlers: Event.EventHandler<this>[] = Reflect.getMetadata(Event.symbol, this) ?? [];
        eventHandlers.forEach(handler => handler(this));
        
        const self = this;
        Promise.resolve().then(() => self.events.emit('init'));
    }
    
}