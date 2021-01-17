import { ObjectResources, ResourceManager, Texture } from "./loader2";
import * as PIXI from "pixi.js";

const app = new PIXI.Application();

const resourceManager = new ResourceManager(app, "/res/resources.json");

resourceManager.loadingPromise.then(() => {
    console.log('finished');
    console.log(resourceManager.resources);

    document.body.appendChild(app.view);
    gameInit();
});

async function gameInit() {
    app.renderer.backgroundColor = 0xffffff;
    const resources = resourceManager.resources;
    const items = resources.items as ObjectResources;
    const devices = items.devices as ObjectResources;
    const computers = devices.computer as ObjectResources;
    const rpi = new PIXI.Sprite((computers.pi.texture as Texture).base);
    app.stage.addChild(rpi);
}