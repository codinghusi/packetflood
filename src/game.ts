import { Engine } from "./engine";
import { GameObject } from "./object-loader";
import * as PIXI from 'pixi.js';
import { Event } from './object-loader';

const game = new Engine('/res/resources.json');


@game.group('computer')
class ComputerObject extends GameObject{
    toggle = false;

    @Event.Init
    init() {
        this.lighting.intensity = 5;

        setInterval(() => {
            this.lighting.enabled = this.toggle;
            this.toggle = !this.toggle;
        }, 100);
    }

    @Event.Tick
    step() {
        this.x += 1;
    }

    @Event.On('connection')
    onConnection(whatHappend: string) {
        if (whatHappend === 'lost') {
            console.log('internet connection lost!');
        }
    }
}


game.loaded().then(async () => {
    const pi = new ComputerObject('rpi-v4');
});