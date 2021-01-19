import { Engine } from "./engine";
import { GameObject } from "./object-loader";
import * as PIXI from 'pixi.js';
import { Event } from './object-loader';

const game = new Engine('/res/resources.json');


@game.forGroup('computer')
class ComputerObject extends GameObject {
    toggle = false;

    @Event.Init
    init() {
        this.lighting.intensity = 5;

        setInterval(() => {
            this.lighting.enabled = this.toggle;
            this.toggle = !this.toggle;
        }, 500);
    }

    @Event.Tick
    step() {
    }
}


game.loaded().then(async () => {
    game.createObject('grassblock', 0, 0);
    game.createObject('grassblock', 0, 1);
    game.createObject('grassblock', 0, 2);
    game.createObject('grassblock', 1, 0);
    game.createObject('grassblock', 1, 1);
    game.createObject('grassblock', 1, 2);
    game.createObject('grassblock', 2, 0);
    game.createObject('grassblock', 2, 1);
    game.createObject('grassblock', 2, 2);

    game.createObject('table', 1, 1, 1);
    game.createObject('rpi-v4', 1, 1, 2);
});