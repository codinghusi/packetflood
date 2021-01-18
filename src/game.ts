import { Engine } from "./engine";
import { GameObject } from "./object-loader";
import * as PIXI from 'pixi.js';
import { Event } from './object-loader';

const game = new Engine('/res/resources.json');


@game.group('computer')
class ComputerObject extends GameObject{
    toggle = false;
    lightBlur = new PIXI.filters.BlurFilter();

    constructor(id: string) {
        super(id);
    }

    @Event.Init
    init() {
        this.sprites.light.filters = [ this.lightBlur ];
        this.lightBlur.blur = 5;
        
        setInterval(() => {
            this.sprites.light.visible = this.toggle;
            this.toggle = !this.toggle;
        }, 500)
    }

    @Event.Tick
    step() {
        this.x += 1;
    }
}


game.loaded().then(async () => {
    const pi = new ComputerObject('rpi-v4');
})