import Light from "./Light.js";
import { Vec3 } from "./types.js";
import MathUtils from "./MathUtils.js";

const mathUtils = new MathUtils();

export default class PointLight extends Light {
  readonly position: Vec3;

  constructor(intensity: number, position: Vec3) {
    super("Point", intensity);
    this.position = position;
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    // precompute shared values
    const L: Vec3 = mathUtils.subtractVectors(this.position, P);
    const DotNL: number = mathUtils.dotVectors(N, L);

    if (DotNL < 0)
      // dont contribute negative light
      return 0;

    const diffuseScalar: number = this.computeScalarDiffuse(N, L, DotNL);
    const specularScalar: number = this.computeScalarHighlight(
      N,
      V,
      s,
      L,
      DotNL,
    );

    const totalScalar: number =
      (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
    const totalContributedIllumination: number = totalScalar * this.intensity;

    return totalContributedIllumination;
  }

  computeScalarDiffuse(N: Vec3, L: Vec3, DotNL: number): number {
    return DotNL / (mathUtils.magnitude(L) * mathUtils.magnitude(N));
  }

  computeScalarHighlight(
    N: Vec3,
    V: Vec3,
    s: number,
    L: Vec3,
    DotNL: number,
  ): number {
    if (s === -1) return -1;

    const TwoN: Vec3 = mathUtils.scaleVector(N, 2);
    const ScaleTwoN: Vec3 = mathUtils.scaleVector(TwoN, DotNL);
    const R: Vec3 = mathUtils.subtractVectors(ScaleTwoN, L);
    const RDotV: number = mathUtils.dotVectors(R, V);

    if (RDotV < 0) return -1;

    const magR: number = mathUtils.magnitude(R);
    const magV: number = mathUtils.magnitude(V);
    const cosA: number = RDotV / (magR * magV);
    const specularScalar: number = cosA ** s;

    return specularScalar;
  }
}
