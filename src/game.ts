import { Engine } from "./engine";
import { GameObject } from "./object-loader";
import * as PIXI from 'pixi.js';

const game = new Engine('/res/resources.json');


@game.group('computer')
class ComputerObject extends GameObject{
    toggle = false;
    lightBlur = new PIXI.filters.BlurFilter();

    constructor(id: string) {
        super(id);
    }

    init() {
        this.sprites.light.filters = [ this.lightBlur ];

        setInterval(() => {
            this.lightBlur.blur = this.toggle ? 5 : 0;
            this.toggle = !this.toggle;
        }, 500)
    }
}


game.loaded().then(async () => {
    const pi = new ComputerObject('rpi-v4');
})