import { Vec3 } from "./types.js";

export default class MathUtils {
  // calculate the dot product of 2 vectors
  dotVectors(a: Vec3, b: Vec3): number {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }

  // subtract two vectors
  subtractVectors(a: Vec3, b: Vec3): Vec3 {
    return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]
  }

  // add two vectors
  addVectors(a: Vec3, b: Vec3): Vec3 {
    return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]
  }

  // scale vector by constant k
  scaleVector(a: Vec3, k: number): Vec3 {
    return [a[0]*k, a[1]*k, a[2]*k]
  }

  magnitude(a: Vec3) {
    return Math.sqrt(this.dotVectors(a,a));
  }
}