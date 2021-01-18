import "reflect-metadata";
import * as PIXI from 'pixi.js';
import { loadResourcesFromJSON } from "./object-loader";
import { Resource } from "./resource-loader";
import { KeyValue } from './utils';
import Events from "events";
const { EventEmitter } = Events;

export const engineSymbol = Symbol();

export class Engine extends EventEmitter {
    public resources: KeyValue<Resource>;
    protected loadingPromise: Promise<void>;
    protected objects = new Map<Function, string>();
    public app = new PIXI.Application();


    constructor(protected resourcePath: string) {
        super();

        // Loading Resources
        const self = this;
        this.loadingPromise = loadResourcesFromJSON(resourcePath).then(resources => {
            self.resources = resources;
        });

        // Running the PIXI App
        this.app.renderer.backgroundColor = 0xffffff;
        document.body.appendChild(this.app.view);

        // start ticks
        requestAnimationFrame(() => self.tick.call(self));
    }

    loaded() {
        return this.loadingPromise;
    }

    group(group: string): ClassDecorator {
        const self = this;
        return (target: Function) => {
            self.objects.set(target, group);
            Reflect.defineMetadata(engineSymbol, self, target);
        }
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