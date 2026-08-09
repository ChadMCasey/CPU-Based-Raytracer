import { SceneData, Primitive, Light, BVHNode } from "../Utility/types";
import { spheres } from "../Data/Sphere";
import { triangles } from "../Data/Triangle";
import { pointLights, directionalLights, ambientLights } from "../Data/Light";
import { generateBVH } from "./BoundingVolumeHierarchy";

export const primatives: Primitive[] = [...spheres, ...triangles];
export const lights: Light[] = [...pointLights, ...directionalLights, ...ambientLights];
export const bvh: BVHNode | null = generateBVH(primatives);

// let nodes: number = 0;

// function traverse(node: BVHNode | null) {
//   nodes++;
//   if (node) {
//     if (node.left) traverse(node.left);
//     if (node.right) traverse(node.right);
//   }
// }
// traverse(bvh);
// console.log(nodes);

// scene data
export const sceneData: SceneData = { lights, primatives, bvh };
