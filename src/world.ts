import { GameObject } from './object-loader';

export interface WorldConfig {
    blockSize: number;
    imageSize: number;
}

export class WorldInstance {
    constructor(public config: WorldConfig,
                public gameObject: GameObject) {
        
    }


    private snapScaleValue(value: number, realBlockSize = 1) {
        return Math.round(value) * this.config.blockSize / realBlockSize;
    }

    private snapDownscaleValue(value: number, realBlockSize = 1) {
        return Math.round(value / this.config.blockSize) / realBlockSize;
    }


    set x(value: number) {
        this.gameObject.x = this.snapScaleValue(value);
    }

    get x() {
        return this.snapDownscaleValue(this.gameObject.x);
    }


    set y(value: number) {
        this.gameObject.y = this.snapScaleValue(value);
    }

    get y() {
        return this.snapDownscaleValue(this.gameObject.y);
    }


    set width(value: number) {
        this.gameObject.width = this.snapScaleValue(value, this.config.imageSize);
    }

    get width() {
        return this.snapDownscaleValue(this.gameObject.width, this.config.imageSize);
    }


    set height(value: number) {
        this.gameObject.height = this.snapScaleValue(value, this.config.imageSize);
    }

    get height() {
        return this.snapDownscaleValue(this.gameObject.height, this.config.imageSize);
    }
}