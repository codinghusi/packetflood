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

export abstract class GameObject extends EventEmitter {
    @EmitChanges()
    x: number;

    @EmitChanges()
    y: number;

    @EmitChanges()
    angle: number;

    @EmitChanges()
    alpha: number;

    // TODO: checkout PIXI.Sprite.children
    protected sprites: KeyValue<PIXI.Sprite> = {}
    protected engine: Engine;
    protected data: any;


    constructor(public id: string) {
        super();

        // Apply all transforms to the sprites if one variable changes
        this.on('property-change', ({key, beforeValue, afterValue}) => {
            Object.values(this.sprites)
                  .forEach((sprite: any) => sprite[key] += afterValue - beforeValue);
        });
    
        // Get all sprites and data together
        this.engine = Reflect.getMetadata(engineSymbol, this.constructor) as Engine;
        const resource = this.engine.getResource(this.id);
        this.data = resource.data;
        this.sprites = mapObject(resource.textures, (name, texture) => {
            return new PIXI.Sprite(texture);
        });

        // Add all Sprites to the stage
        Object.values(this.sprites).forEach(sprite => this.engine.app.stage.addChild(sprite));
        
        const self = this;
        Promise.resolve().then(() => self.init.call(self) );
    }
    
    init() {

    }
}