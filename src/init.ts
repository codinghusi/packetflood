import { Engine } from "./internal/engine";
import { Vec2 } from "./internal/vectors";

export const worldSize = new Vec2(10, 10);
export const buildingSize = 5;

export const game = new Engine('/res/resources.json', worldSize, 200);