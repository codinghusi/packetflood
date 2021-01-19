import { GameObject } from './object-loader';
import { Vec2, Vec3 } from './vectors';

export interface WorldConfig {
    worldWidth: number;
    worldHeight: number;
    blockSize: number;
    imageSize: number;
}

type Rotation = 0 | 90 | 180 | 270 | 360;

export class WorldInstance {
    protected position = new Vec3();
    protected rotationOffset = new Vec2();

    constructor(public config: WorldConfig,
                public gameObject: GameObject) {
    }

    fakeRotate(rotation: Rotation) {
        const obj = this.gameObject;
        const scale = obj.scale;

        scale.x = Math.abs(scale.x);
        scale.y = Math.abs(scale.y);

        this.rotationOffset.reset();

        switch(rotation) {
            case 0:
            case 360:
                break;
            case 90:
                scale.x *= -1;
                this.rotationOffset.x = 1;
                this.rotationOffset.y = -1;
                break;
            case 270:
                scale.x *= -1;
                this.rotationOffset.x = 2;
                break;
            case 180:
                this.rotationOffset.x = 1;
                this.rotationOffset.y = -1;
                break;
        }
        this.updateCoordinates();
    }

    public snapCoordinates() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
    }

    private scaleUpCoordinates(value: number, offset = 0, axisScale: number) {
        return (value + offset) * this.config.blockSize * axisScale;
    }

    private scaleUpSize(value: number, realBlockSize: number) {
        return value * this.config.blockSize / realBlockSize;
    }

    private scaleDownSize(value: number, realBlockSize: number) {
        return value / this.config.blockSize / realBlockSize;
    }


    private updateCoordinates() {
        const xOffset = this.config.worldWidth / 2 - this.y + this.rotationOffset.x + 1;
        const yOffset = -this.z * 2 + this.x + this.rotationOffset.y + 1;
        this.gameObject.x = this.scaleUpCoordinates(this.x, xOffset, 1/2);
        this.gameObject.y = this.scaleUpCoordinates(this.y, yOffset, 1/4);
        this.gameObject.zIndex = (this.y + this.z);
    }

    get x() {
        return this.position.x;
    }

    set x(value: number) {
        this.position.x = value;
        this.updateCoordinates();
    }

    get y() {
        return this.position.y;
    }

    set y(value: number) {
        this.position.y = value;
        this.updateCoordinates();
    }

    get z() {
        return this.position.z;
    }

    set z(value: number) {
        this.position.z = value;
        this.updateCoordinates();
    }


    set width(value: number) {
        this.gameObject.width = this.scaleUpSize(value, this.config.imageSize);
    }

    get width() {
        return this.scaleDownSize(this.gameObject.width, this.config.imageSize);
    }


    set height(value: number) {
        this.gameObject.height = this.scaleUpSize(value, this.config.imageSize);
    }

    get height() {
        return this.scaleDownSize(this.gameObject.height, this.config.imageSize);
    }
}