import Light from "./Light";
import { RGB, serializedAmbientLight, Vec3 } from "../Utility/types";

export default class AmbientLight extends Light {
  constructor(intensity: number, color: RGB) {
    super("Ambient", intensity, color);
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    return this.intensity;
  }

  getShadowProperties(P: Vec3): [Vec3, number] | null {
    return null;
  }

  serialize(): serializedAmbientLight {
    return {
      type: "ambient",
      color: this.color,
      intensity: this.intensity,
    };
  }
}
