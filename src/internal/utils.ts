export interface KeyValue<Value> {
    [key: string]: Value;
}

export function mapObject(obj: any, callback: (key: string, value: any) => any) {
    return Object.fromEntries(
        Object.entries(obj)
              .map( ([key, value]) => ([key, callback(key, value)]) )
    );
}

export type HTMLSVGElement = SVGElement & HTMLElement;

// from https://www.typescriptlang.org/docs/handbook/mixins.html
function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
            derivedCtor.prototype,
            name,
            Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null)
        );
        });
    });
}