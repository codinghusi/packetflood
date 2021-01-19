import "reflect-metadata";
import * as PIXI from 'pixi.js';
import { GameObject, GameObjectConstructor, loadResourcesFromJSON } from "./object-loader";
import { Resource } from "./resource-loader";
import { KeyValue } from './utils';
import Events from "events";
import { WorldConfig } from "./world";
const { EventEmitter } = Events;

export const engineSymbol = Symbol();

export class Engine extends EventEmitter {
    protected loadingPromise: Promise<void>;
    public app = new PIXI.Application();
    public resources: KeyValue<Resource>;
    public worldConfig: WorldConfig;
    protected objects = new Map<string, GameObjectConstructor>();
    protected defaultObject = class extends GameObject {}

    constructor(protected resourcePath: string) {
        super();

        this.worldConfig = {
            worldWidth: 3,
            worldHeight: 3,
            blockSize: 200,
            imageSize: 500,
        };

        // Loading Resources
        const self = this;
        this.loadingPromise = loadResourcesFromJSON(resourcePath).then(resources => {
            self.resources = resources;
        });

        // Default Object
        this.asDefault()(this.defaultObject);

        // Stage config
        this.app.stage.sortableChildren = true;

        // Running the PIXI App
        this.app.renderer.backgroundColor = 0xffffff;
        document.body.appendChild(this.app.view);

        // Start Ticks
        requestAnimationFrame(() => self.tick.call(self));
    }

    loaded() {
        return this.loadingPromise;
    }

    forGroup(group: string): ClassDecorator {
        const self = this;
        return (target: any) => {
            self.objects.set(group, target);
            Reflect.defineMetadata(engineSymbol, self, target);
        }
    }

    asDefault() {
        const self = this;
        return (target: any) => {
            self.defaultObject = target;
            Reflect.defineMetadata(engineSymbol, self, target);
        }
    }

    createObject(id: string, x: number, y: number, z = 0) {
        const resource = this.getResource(id);
        if (!resource) {
            throw `Couldn't load resource '${id}'`;
        }
        const group = resource.group;
        const handler = this.objects.get(group) ?? this.defaultObject;
        const obj = new handler(id);
        obj.world.x = x;
        obj.world.y = y;
        obj.world.z = z;
        return obj;
    }

    getResource(id: string) {
        console.log(this.resources);
        return this.resources[id];
    }

    tick() {
        const self = this;
        requestAnimationFrame(() => self.tick.call(self));
        this.emit('tick');
    }
}