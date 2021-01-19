import { Event } from "../internal/gameobject/events";
import { game } from "../init";
import { GameObject } from "../internal/gameobject/game-object";

@game.forGroup('computer')
class ComputerObject extends GameObject {
    toggle = false;

    @Event.Init
    init() {
        this.lighting.intensity = 5;
        this.timers.blink.start();
    }

    @Event.Interval(500, 'blink')
    blink() {
        this.lighting.enabled = this.toggle;
        this.toggle = !this.toggle;
    }
}