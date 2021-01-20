import { game } from "../init";
import { Vec2 } from "../internal/vectors";


export function generateMap(worldSize: Vec2, roomSize: number, wallHeight: number) {

    // Map Floor
    for (let x = 0; x < worldSize.width; ++x) {
        for (let y = 0; y < worldSize.height; ++y) {
            game.createInstance('grassblock', x, y);
        }
    }


    // Room
    const xOffset = Math.round((worldSize.width - roomSize) / 2) - 1;
    const yOffset = Math.round((worldSize.height - roomSize) / 2) - 1;

    // Floor
    for (let x = 0; x <= roomSize; ++x) {
        for (let y = 0; y <= roomSize; ++y) {
            game.createInstance('floor', x + xOffset, y + yOffset, 1);
        }
    }

    // Walls
    for (let x = 0; x <= roomSize; ++x) {
        for (let z = 0; z < wallHeight; ++ z) {
            game.createInstance('wall', xOffset + x, yOffset, z + 1)
                .world.fakeRotate(0);
        }
            
    }
    for (let y = 0; y <= roomSize; ++y) {
        for (let z = 0; z < wallHeight; ++ z) {
            game.createInstance('wall', xOffset, yOffset + y, z + 1)
                .world.fakeRotate(90);
        }
        
    }

    // Table with Pi
    game.createInstance('table', 3, 4, 1);
    game.createInstance('rpi-v4', 3, 4, 2);
}