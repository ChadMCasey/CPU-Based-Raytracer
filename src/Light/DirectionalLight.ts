import { DirectionLight } from "../Utility/types";

export const directionalLights: DirectionLight[] = [
  {
    type: "directional",
    intensity: 0.2,
    color: [255, 255, 255],
    direction: [1, 4, 4],
    maxT: Number.POSITIVE_INFINITY,
  },
];
