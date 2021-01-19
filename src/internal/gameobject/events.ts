import { GameObject } from "./game-object";
import { TickInterval, TickTimer } from "./timer";




export namespace Event {
    export const symbol = Symbol('events');
    export type EventHandler<T extends GameObject> = (target: T) => void;

    function addInitFunctionToGameObject<T extends GameObject>(target: any, init: (obj: T) => void) {
            const eventHandlers = Reflect.getMetadata(symbol, target) ?? [];
            eventHandlers.push(init);
            Reflect.defineMetadata(symbol, eventHandlers, target);
    }

    // FIXME: typing any to EventEmitter (currently fails)
    function eventHandler<T extends GameObject>(eventEmitter: (target: T) => any, eventName: string) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const myEvent = (target: T) => eventEmitter(target).on(eventName, (...args: any[]) => (target as any)[propertyKey].call(target, ...args));
            addInitFunctionToGameObject(target, myEvent);
        }
    }
    
    export const Init = eventHandler(target => target.events, 'init');
    export const Tick = eventHandler(target => target.engine, 'tick');
    
    export function On(eventName: string) {
        return eventHandler(target => target.events, eventName);
    }

    function createTimerThing(constructor_: any) {
        return function(ticks: number, name?: string, start?: boolean) {
            return (target: any, propertyKey: string) => {
                addInitFunctionToGameObject(target, obj => {
                    const timer = new constructor_(ticks, () => target[propertyKey].call(obj), start);
                    if (name) {
                        obj.timers[name] = timer;
                    }
                });
            }
        }
    }

    export const Timer = createTimerThing(TickTimer);
    export const Interval = createTimerThing(TickInterval);
}