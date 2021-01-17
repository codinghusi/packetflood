import Events from 'events';
import { loadResource } from "./resource-loader";
import { KeyValue } from './utils';

// Fix for Snowpack
const { EventEmitter } = Events;
type EventEmitter = typeof EventEmitter;

export async function loadResourcesFromJSON(path: string) {
    const response = await fetch(path);
    const json = await response.json();
    const rawObjects = json.objects;
    const resourcePromises = Object.values(rawObjects)
        .map((object: any) => loadResource(object.id, object, object.path));
    const resourceList = await Promise.all(resourcePromises);
    const resources = resourceList.reduce((acc, value: any) => acc[value.id] = value, {} as any);
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

const objects = new Map<Function, string>();

export function ObjectGroup(group: string): ClassDecorator {
    return (target: Function) => {
        objects.set(target, group);
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

    public sprites: KeyValue<PIXI.Sprite> = {}


    constructor(public id: string) {
        super();

        // Apply all transforms to the sprites
        this.on('property-change', ({key, beforeValue, afterValue}) => {
            Object.values(this.sprites)
                  .forEach((sprite: any) => sprite[key] += afterValue - beforeValue);
        });
    }
                
}