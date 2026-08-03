import { SceneData, Primative, Light } from "../Utility/types";
import { spheres } from "../Data/Sphere";
import { triangles } from "../Data/Triangle";
import { pointLights, directionalLights, ambientLights } from "../Data/Light";

export const primatives: Primative[] = [...spheres, ...triangles];
export const lights: Light[] = [...pointLights, ...directionalLights, ...ambientLights];

// scene data
export const sceneData: SceneData = { lights, primatives };
