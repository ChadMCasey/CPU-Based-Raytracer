import { Triangle } from "../Utility/types";
import { createTriangle, createCube } from "../Utility/triangleUtils";

export const triangles: Triangle[] = [
  ...createCube([0, 1, 3], 1, [200, 0, 255], 400, 0.001),
];
