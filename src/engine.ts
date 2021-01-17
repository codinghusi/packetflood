import * as PIXI from 'pixi.js';
import { loadResourcesFromJSON } from "./object-loader";
import { Resource } from "./resource-loader";
import "reflect-metadata";
import { KeyValue } from './utils';

export const engineSymbol = Symbol();

export class Engine {
    public resources: KeyValue<Resource>;
    protected loadingPromise: Promise<void>;
    protected objects = new Map<Function, string>();
    public app = new PIXI.Application();

    constructor(protected resourcePath: string) {
        // Loading Resources
        this.loadingPromise = loadResourcesFromJSON(resourcePath).then(resources => {
            this.resources = resources;
        });

        // Running the PIXI App
        this.app.renderer.backgroundColor = 0xdddddd;
        document.body.appendChild(this.app.view);
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
}