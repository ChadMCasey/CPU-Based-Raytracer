import Light  from './Light.js';
import { Vec3 } from './types.js';
import MathUtils from './MathUtils.js';

const mathUtils = new MathUtils();

export default class DirectionalLight extends Light {
  readonly direction: Vec3;
  
  constructor(intensity: number, direction: Vec3) {
    super('Directional', intensity);
    this.direction = direction;
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    const DotNL = mathUtils.dotVectors(N, this.direction);

    if (DotNL < 0) // dont contribute negative light 
      return 0; 

    const diffuseScalar: number = DotNL / (mathUtils.magnitude(N) * mathUtils.magnitude(this.direction));

    if (s === -1) // dont add specular highlights
      return diffuseScalar * this.intensity; 

    const TwoN: Vec3 = mathUtils.scaleVector(N, 2);
    const ScaleTwoN: Vec3 = mathUtils.scaleVector(TwoN, DotNL);
    const R: Vec3 = mathUtils.subtractVectors(ScaleTwoN, this.direction);
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