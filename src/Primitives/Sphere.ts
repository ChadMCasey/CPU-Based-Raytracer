import { Sphere } from "../Utility/types";

export const spheres: Sphere[] = [
  {
    type: "sphere",
    radius: 1,
    center: [0, -1, 3],
    color: [255, 0, 0],
    specular: 500,
    reflective: 0.2,
  },
  {
    type: "sphere",
    radius: 1,
    center: [2, 0, 4],
    color: [0, 0, 255],
    specular: 500,
    reflective: 0.3,
  },
  {
    type: "sphere",
    radius: 1,
    center: [-2, 0, 4],
    color: [0, 255, 0],
    specular: 10,
    reflective: 0.4,
  },
  {
    type: "sphere",
    radius: 5000,
    center: [0, -5001, 0],
    color: [255, 255, 255],
    specular: 1000,
    reflective: 0.5,
  },
];
