import Light from "./Light";
import { RGB, serializedDirectionLight, Vec3 } from "../Utility/types";
import MathUtils from "../Utility/MathUtils";

const mathUtils = new MathUtils();

export default class DirectionalLight extends Light {
  readonly direction: Vec3;

  constructor(intensity: number, direction: Vec3, color: RGB) {
    super("Directional", intensity, color);
    this.direction = direction;
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    const DotNL = MathUtils.dotVectorsV3(N, this.direction);

    if (DotNL < 0) return 0;

    const diffuseScalar: number = this.computeScalarDiffuse(N, this.direction, DotNL);
    const specularScalar: number = this.computeScalarHighlight(N, V, s, this.direction);

    const totalScalar: number = (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
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

  getShadowProperties(P: Vec3): [Vec3, number] | null {
    return [this.direction, Number.POSITIVE_INFINITY];
  }

  serialize(): serializedDirectionLight {
    return {
      type: "directional",
      direction: this.direction,
      intensity: this.intensity,
      color: this.color,
      maxT: Number.POSITIVE_INFINITY,
    };
  }
}
