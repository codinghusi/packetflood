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
        this.lightBlur.blur = 5;
        this.sprites.object.width = 1000;
        this.sprites.object.height = 1000;

        setInterval(() => {
            this.sprites.light.visible = this.toggle;
            this.toggle = !this.toggle;
        }, 500)
    }
}


game.loaded().then(async () => {
    const pi = new ComputerObject('rpi-v4');
})