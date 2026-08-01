import { LightType, Vec3, RGB, SerializedLight } from "../Utility/types";

export default abstract class Light {
  readonly type: LightType;
  readonly intensity: number;
  readonly color: RGB;

  constructor(type: LightType, intensity: number, color: RGB) {
    this.intensity = intensity;
    this.type = type;
    this.color = color;
  }

  abstract computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number;
  abstract getShadowProperties(P: Vec3): [Vec3, number] | null;
  abstract serialize(): SerializedLight;
}
