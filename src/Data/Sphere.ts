import { Sphere } from "../Utility/types";
import { createSphere } from "../Utility/sphereUtils";

export const spheres: Sphere[] = [
  createSphere(1, [0, -1, 4], [102, 197, 204], 500, 0.2),
  createSphere(1, [4, 0, 4], [246, 207, 113], 500, 0.3),
  createSphere(1, [-4, 0, 4], [248, 156, 116], 10, 0.4),
  createSphere(100, [0, -101, 0], [255, 255, 255], 1000, 0.5),
];
