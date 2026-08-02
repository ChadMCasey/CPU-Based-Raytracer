import { SceneData, Primative, Light } from "../Utility/types";
import { spheres } from "../Primitives/Sphere";
import { pointLights } from "../Light/PointLight";
import { directionalLights } from "../Light/DirectionalLight";
import { ambientLights } from "../Light/AmbientLight";

export const primatives: Primative[] = [...spheres];
export const lights: Light[] = [
  ...pointLights,
  ...directionalLights,
  ...ambientLights,
];

// scene data
export const sceneData: SceneData = { lights, primatives };
