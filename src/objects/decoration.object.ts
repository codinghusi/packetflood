import { game } from "../init";
import { GameObject } from "../internal/gameobject/game-object";
import { Event } from "../internal/gameobject/events";
import * as PIXI from 'pixi.js';


@game.forGroup('decoration')
class DecorationObject extends GameObject {
    @Event.Init
    init() {
        if (this.id === 'wall') {
            const text = new PIXI.Text(`${this.world.x}, ${this.world.y}, ${this.zIndex}`, {
                fontSize: 30,
                fill: 0xeeeeee,
                decoration: 'underline',
            });
            text.position.x = this.x + 80;
            text.position.y = this.y + 25;
            text.zIndex = 10000;
    
            this.engine.app.stage.addChild(text);
        }

        if (this.id === 'grassblock' && false) {
            const text = new PIXI.Text(`${this.world.x}, ${this.world.y}`, {
                fontSize: 30,
                fill: 0xffffff
            });
            text.position.x = this.x + 80;
            text.position.y = this.y + 55;
            text.zIndex = 10000;
    
            this.engine.app.stage.addChild(text);
        }
    }
}