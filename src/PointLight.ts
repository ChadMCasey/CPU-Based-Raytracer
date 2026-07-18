import Light  from './Light.js';
import { Vec3 } from './types.js';
import MathUtils from './MathUtils.js';

const mathUtils = new MathUtils();

export default class PointLight extends Light {
  readonly position: Vec3;

  constructor(intensity: number, position: Vec3) {
    super('Point', intensity);
    this.position = position;
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    const L: Vec3 = mathUtils.subtractVectors(this.position, P);
    const DotNL: number = mathUtils.dotVectors(L, N);

    if (DotNL < 0) // dont contribute negative light
      return 0;
    
    let diffuseScalar: number = DotNL / (mathUtils.magnitude(L) * mathUtils.magnitude(N));

    if (s === -1) // dont add specular highlights
      return diffuseScalar * this.intensity; 

    const TwoN: Vec3 = mathUtils.scaleVector(N, 2);
    const ScaleTwoN: Vec3 = mathUtils.scaleVector(TwoN, DotNL);
    const R: Vec3 = mathUtils.subtractVectors(ScaleTwoN, L);
    const RDotV: number = mathUtils.dotVectors(R, V);

    // ensure that our angle between View vector V 
    // and reflection vector R does not exceed 90 deg
    if (RDotV < 0)
      return diffuseScalar * this.intensity;

    const magR: number = mathUtils.magnitude(R);
    const magV: number = mathUtils.magnitude(V);
    const cosA: number = RDotV/(magR * magV);
    const specularScalar: number = cosA ** s;

    const totalScalar: number = specularScalar + diffuseScalar;

    return totalScalar * this.intensity;
  }
}