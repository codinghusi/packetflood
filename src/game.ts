import * as PIXI from 'pixi.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);

app.loader
    .add('pi', '/res/sprites/pi.svg')
    .add('pi_light_front', '/res/sprites/pi.svg')
    .add('pi_light_side', '/res/sprites/pi.svg')
    .add('pi_light_top', '/res/sprites/pi.svg')
    .load((loader, resources) => {
        const pi = resources.pi.texture;
    })