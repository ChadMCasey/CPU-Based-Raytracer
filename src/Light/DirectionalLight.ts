import Light from "./Light.js";
import { Vec3 } from "../Configuration/types.js";
import MathUtils from "../Utils/MathUtils.js";

const mathUtils = new MathUtils();

export default class DirectionalLight extends Light {
  readonly direction: Vec3;

  constructor(intensity: number, direction: Vec3) {
    super("Directional", intensity);
    this.direction = direction;
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    const DotNL = mathUtils.dotVectors(N, this.direction);

    if (DotNL < 0) return 0;

    const diffuseScalar: number = this.computeScalarDiffuse(
      N,
      this.direction,
      DotNL,
    );
    const specularScalar: number = this.computeScalarHighlight(
      N,
      V,
      s,
      this.direction,
    );

    const totalScalar: number =
      (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
    const totalContributedIllumination: number = totalScalar * this.intensity;

    return totalContributedIllumination;
  }

  computeScalarDiffuse(N: Vec3, L: Vec3, DotNL: number): number {
    return DotNL / (mathUtils.magnitude(L) * mathUtils.magnitude(N));
  }

  computeScalarHighlight(N: Vec3, V: Vec3, s: number, L: Vec3): number {
    if (s === -1) return -1;

    const R: Vec3 = mathUtils.reflectVector(L, N);
    const RDotV: number = mathUtils.dotVectors(R, V);

    if (RDotV < 0) return -1;

    const magR: number = mathUtils.magnitude(R);
    const magV: number = mathUtils.magnitude(V);
    const cosA: number = RDotV / (magR * magV);
    const specularScalar: number = cosA ** s;

    return specularScalar;
  }

  getShadowProperties(P: Vec3): [Vec3, number] | null {
    return [this.direction, Number.POSITIVE_INFINITY];
  }
}
