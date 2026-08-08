import { PointLight, AmbientLight, DirectionLight } from "../Utility/types";

export const pointLights: PointLight[] = [
  {
    type: "point",
    intensity: 0.6,
    position: [2, 1, 0],
    color: [255, 255, 255],
  },
];

export const directionalLights: DirectionLight[] = [
  {
    type: "directional",
    intensity: 0.2,
    color: [255, 255, 255],
    direction: [1, 4, 4],
    maxT: Number.POSITIVE_INFINITY,
  },
];

export const ambientLights: AmbientLight[] = [{ type: "ambient", intensity: 0.2, color: [255, 255, 255] }];
