import { buildingSize, game, worldSize } from "./init";
import { generateMap } from "./maps/mapgenerator";

import './objects';



game.loaded().then(async () => {
    generateMap(worldSize, buildingSize);
    game.createInstance('rpi-v4', 0, 0, 1);
});