import { game } from "../init";
import { Vec2 } from "../internal/vectors";


export function generateMap(worldSize: Vec2, roomSize: number) {

    // Floor
    for (let x = 0; x < worldSize.width; ++x) {
        for (let y = 0; y < worldSize.height; ++y) {
            game.createInstance('grassblock', x, y);
        }
    }

    // Room with Walls
    const xOffset = Math.round((worldSize.width - roomSize) / 2);
    const yOffset = Math.round((worldSize.height - roomSize) / 2);
    for (let x = 0; x < roomSize; ++x) {
        game.createInstance('wall', xOffset + x, yOffset)
            .world.fakeRotate(90);
        game.createInstance('wall', xOffset + x, yOffset + roomSize)
            .world.fakeRotate(270);
    }
    for (let y = 0; y < roomSize; ++y) {
        game.createInstance('wall', xOffset, yOffset + y);
        game.createInstance('wall', xOffset + roomSize, yOffset + y);
    }
}