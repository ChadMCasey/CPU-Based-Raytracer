import { SceneData, Primative, Light } from "../Utility/types";
import { spheres } from "../Data/Sphere";
import { pointLights, directionalLights, ambientLights } from "../Data/Light";

export const primatives: Primative[] = [...spheres];
export const lights: Light[] = [
  ...pointLights,
  ...directionalLights,
  ...ambientLights,
];

// scene data
export const sceneData: SceneData = { lights, primatives };
