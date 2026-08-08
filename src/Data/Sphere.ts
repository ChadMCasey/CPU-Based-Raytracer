import { Sphere } from "../Utility/types";

export const spheres: Sphere[] = [
  {
    type: "sphere",
    r: 1,
    rSquared: 1 * 1,
    center: [0, -1, 3],
    color: [102, 197, 204],
    specular: 500,
    reflective: 0.2,
  },
  {
    type: "sphere",
    r: 1,
    rSquared: 1 * 1,
    center: [2, 0, 4],
    color: [246, 207, 113],
    specular: 500,
    reflective: 0.3,
  },
  {
    type: "sphere",
    r: 1,
    rSquared: 1 * 1,
    center: [-2, 0, 4],
    color: [248, 156, 116],
    specular: 10,
    reflective: 0.4,
  },
  {
    type: "sphere",
    r: 5000,
    rSquared: 5000 * 5000,
    center: [0, -5001, 0],
    color: [255, 255, 255],
    specular: 1000,
    reflective: 0.5,
  },
];
