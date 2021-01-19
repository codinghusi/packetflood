import * as PIXI from 'pixi.js';

export class ObjectLight {
    blurFilter = new PIXI.filters.BlurFilter();

    get intensity() {
        return this.blurFilter.blur;
    }

    set intensity(value: number) {
        this.blurFilter.blur = value;
    }

    get enabled() {
        return this.sprite.visible;
    }

    set enabled(value: boolean) {
        this.sprite.visible = value;
    }

    constructor(public sprite: PIXI.Sprite,
                intensity: number,
                enabled: boolean) {
        this.sprite.filters = [ this.blurFilter ];
        this.intensity = intensity;
        this.enabled = enabled;
    }
}

