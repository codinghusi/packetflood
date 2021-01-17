export interface KeyValue<Value> {
    [key: string]: Value;
}

export function mapObject(obj: any, callback: (key: string, value: any) => any) {
    return Object.fromEntries(
        Object.entries(obj)
              .map( ([key, value]) => ([key, callback(key, value)]) )
    );
}