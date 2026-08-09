import { Triangle } from "../Utility/types";
import { createCube, createSquarePyramid } from "../Utility/triangleUtils";

const cube: Triangle[] = createCube([0, 1, 3], 1, [200, 0, 255], 400, 0.001);

const squarePyramid: Triangle[] = [...createSquarePyramid([-2, 0, 2], 1, [253, 0, 3], 400, 0.5)];

export const triangles: Triangle[] = [...cube, ...squarePyramid];
