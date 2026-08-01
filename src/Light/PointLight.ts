import Light from "./Light";
import { RGB, serializedPointLight, Vec3 } from "../Utility/types";
import MathUtils from "../Utility/MathUtils";

export default class PointLight extends Light {
  readonly position: Vec3;

  constructor(intensity: number, position: Vec3, color: RGB) {
    super("Point", intensity, color);
    this.position = position;
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    const L: Vec3 = MathUtils.subtractVectors(this.position, P);
    const DotNL: number = MathUtils.dotVectorsV3(N, L);

    if (DotNL < 0) return 0;

    const diffuseScalar: number = this.computeScalarDiffuse(N, L, DotNL);
    const specularScalar: number = this.computeScalarHighlight(N, V, s, L);

    const totalScalar: number =
      (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
    const totalContributedIllumination: number = totalScalar * this.intensity;

    return totalContributedIllumination;
  }

  computeScalarDiffuse(N: Vec3, L: Vec3, DotNL: number): number {
    return DotNL / (MathUtils.magnitudeV3(L) * MathUtils.magnitudeV3(N));
  }

  computeScalarHighlight(N: Vec3, V: Vec3, s: number, L: Vec3): number {
    if (s === -1) return -1;

    const R: Vec3 = MathUtils.reflectVector(L, N);
    const RDotV: number = MathUtils.dotVectorsV3(R, V);

    if (RDotV < 0) return -1;

    const magR: number = MathUtils.magnitudeV3(R);
    const magV: number = MathUtils.magnitudeV3(V);
    const cosA: number = RDotV / (magR * magV);
    const specularScalar: number = cosA ** s;

    return specularScalar;
  }

  getShadowProperties(P: Vec3): [Vec3, number] {
    return [MathUtils.subtractVectors(this.position, P), 1];
  }

  serialize(): serializedPointLight {
    return {
      type: "point",
      position: this.position,
      intensity: this.intensity,
      color: this.color,
    };
  }
}
