import { LightType, Vec3 } from "./types.js";

export default abstract class Light {
  readonly type: LightType;
  readonly intensity: number;

  constructor(type: LightType, intensity: number) {
    this.intensity = intensity;
    this.type = type;
  }

  abstract computeIllumination(P: Vec3,  N: Vec3, V: Vec3, s: number): number;
}
