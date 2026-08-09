import { PointLight, AmbientLight, DirectionLight } from "../Utility/types";
import { createDirectionalLight } from "../Utility/lightUtils";

export const pointLights: PointLight[] = [
  {
    type: "point",
    intensity: 0.6,
    position: [2, 1, 0],
    color: [255, 255, 255],
  },
];

export const directionalLights: DirectionLight[] = [
  createDirectionalLight([255, 255, 255], 0.2, [1, 4, 4], Number.POSITIVE_INFINITY),
];

export const ambientLights: AmbientLight[] = [{ type: "ambient", intensity: 0.2, color: [255, 255, 255] }];
