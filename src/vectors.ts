

export class Vec2 {
    constructor(public x = 0,
                public y?: number) {
        if (!y) {
            this.y = this.x;
        }
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }
}

export class Vec3 {
    constructor(public x = 0,
                public y?: number,
                public z?: number) {
        if (!y) {
            this.y = this.x;
        }
        if (!z) {
            this.z = this.x;
        }
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}