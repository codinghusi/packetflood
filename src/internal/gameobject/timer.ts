

export abstract class TickThing {
    public value: number;

    constructor(public ticks: number,
                public callback: () => void,
                autostart = false) {
        if (autostart) {
            this.start();
        }
    }

    abstract start(): void;
    abstract cancel(): void;
}


// FIXME: Definetly not Tick based xD
export class TickTimer extends TickThing {
    start() {
        this.value = setTimeout(this.callback, this.ticks) as unknown as number;
    }

    cancel() {
        clearTimeout(this.value);
    }
}

// FIXME: Definetly not Tick based xD
export class TickInterval extends TickThing {
    start() {
        this.value = setInterval(this.callback, this.ticks) as unknown as number;
    }

    cancel() {
        clearInterval(this.value);
    }
}