import { Triangle } from "../Utility/types";
import { createTriangle } from "../Utility/triangleUtils";

export const triangles: Triangle[] = [
  // front face
  createTriangle([-1, 1, 4], [-1, 2, 4], [1, 2, 4], [189, 0, 255], 600, 0.2),
  createTriangle([-1, 1, 4], [1, 2, 4], [1, 1, 4], [189, 0, 255], 600, 0.2),
  // right face
  createTriangle([1, 2, 4], [1, 1, 5], [1, 1, 4], [189, 0, 255], 600, 0.2),
  createTriangle([1, 2, 4], [1, 2, 5], [1, 1, 5], [189, 0, 255], 600, 0.2),
  // left face
  createTriangle([-1, 2, 4], [-1, 1, 5], [-1, 1, 4], [189, 0, 255], 600, 0.2),
  createTriangle([-1, 2, 4], [-1, 1, 5], [-1, 2, 5], [189, 0, 255], 600, 0.2),
  // back face
  createTriangle([-1, 1, 5], [-1, 2, 5], [1, 2, 5], [189, 0, 255], 600, 0.2),
  createTriangle([-1, 1, 5], [1, 2, 5], [1, 1, 5], [189, 0, 255], 600, 0.2),
  // bottom face
  createTriangle([-1, 1, 5], [1, 1, 4], [1, 1, 5], [189, 0, 255], 600, 0.2),
  createTriangle([-1, 1, 4], [-1, 1, 5], [1, 1, 4], [189, 0, 255], 600, 0.2),
  // top face
  createTriangle([-1, 2, 5], [1, 2, 4], [1, 2, 5], [189, 0, 255], 600, 0.2),
  createTriangle([-1, 2, 4], [-1, 2, 5], [1, 2, 4], [189, 0, 255], 600, 0.2),
];
