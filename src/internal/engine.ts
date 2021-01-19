import "reflect-metadata";
import * as PIXI from 'pixi.js';
import { loadResourcesFromJSON } from "./gameobject/resources-from-json";
import { Resource } from "./resource-loader";
import { KeyValue } from './utils';
import Events from "events";
import { WorldConfig } from "./world";
import { Vec2 } from "./vectors";
import { GameObjectConstructor, GameObject } from "./gameobject/game-object";
const { EventEmitter } = Events;

export const engineSymbol = Symbol();

export class Engine extends EventEmitter {
    protected loadingPromise: Promise<void>;
    public app: PIXI.Application;
    public resources: KeyValue<Resource>;
    public worldConfig: WorldConfig;
    protected objects = new Map<string, GameObjectConstructor>();
    protected defaultObject = class extends GameObject {}

    constructor(protected resourcePath: string, worldSize: Vec2, blockSize: number) {
        super();

        // Config
        this.worldConfig = {
            worldSize,
            blockSize,
            imageSize: 500,
        };

        // Creating the app
        this.app = new PIXI.Application({
            width: worldSize.width * blockSize + 200,
            height: worldSize.height * blockSize + 200
        });

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

    createInstance(id: string, x: number, y: number, z = 0) {
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
        return this.resources[id];
    }

    tick() {
        const self = this;
        requestAnimationFrame(() => self.tick.call(self));
        this.emit('tick');
    }
}