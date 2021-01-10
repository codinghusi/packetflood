import * as PIXI from 'pixi.js'

class LightTextures {
    constructor(public top: PIXI.Texture,
                public front: PIXI.Texture,
                public side: PIXI.Texture) {}

    applyTransformation(texture: PIXI.Texture) {
        Object.assign(this.top, texture);
        Object.assign(this.front, texture);
        Object.assign(this.side, texture);
    }
}

class Texture {
    public base: PIXI.Texture;

    constructor(base: PIXI.Texture,
                public light: LightTextures) {
        const proxy = new Proxy(base, {
            set(target, prop, newval) {
                this.light.applyTransformation(proxy);
                return newval;
            }
        });
        this.base = proxy;
    }

    brightness(intensity: number) {

    }
}