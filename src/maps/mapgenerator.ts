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
    const xOffset = Math.round((worldSize.width - roomSize) / 2) - 1;
    const yOffset = Math.round((worldSize.height - roomSize) / 2) - 1;
    for (let x = 0; x <= roomSize; ++x) {
        game.createInstance('wall', xOffset + x, yOffset, 1)
            .world.fakeRotate(0);
            
    }
    for (let y = 0; y <= roomSize; ++y) {
        game.createInstance('wall', xOffset, yOffset + y, 1)
            .world.fakeRotate(90);
    }
}