import Events from "events";
import { Engine, engineSymbol } from "../engine";
import { KeyValue, mapObject } from "../utils";
import { WorldInstance } from "../world";
import { ObjectLight } from "./object-light";
import { Event } from "./events";
import { TickThing } from "./timer";
import * as PIXI from 'pixi.js';


// Fix for Snowpack
const { EventEmitter } = Events;
type EventEmitter = typeof EventEmitter;

export type GameObjectConstructor = new (id: string) => GameObject;


export abstract class GameObject extends PIXI.Container {
    protected sprites: KeyValue<PIXI.Sprite> = {}
    public engine: Engine;
    protected data: any;
    public events = new EventEmitter();
    protected lighting: ObjectLight;
    public world: WorldInstance;
    public timers: KeyValue<TickThing> = {};

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

        // World
        this.world = new WorldInstance(this.engine.worldConfig, this);
        this.world.width = 1;
        this.world.height = 1;

        // Apply all events
        const eventHandlers: Event.EventHandler<this>[] = Reflect.getMetadata(Event.symbol, this) ?? [];
        eventHandlers.forEach(handler => handler(this));
        
        const self = this;
        Promise.resolve().then(() => self.events.emit('init'));
    }

}