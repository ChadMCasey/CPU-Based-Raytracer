import { LightType, Vec3 } from "./types.js";
import MathUtils from "./MathUtils.js";

const mathUtils = new MathUtils();

export abstract class Light {
  readonly type: LightType;
  readonly intensity: number;

  constructor(type: LightType, intensity: number) {
    this.intensity = intensity;
    this.type = type;
  }

  abstract computeIllumination(P: Vec3,  N: Vec3): number;
}


export class AmbientLight extends Light {
  constructor(intensity: number) {
    super('Ambient', intensity);
  }

  computeIllumination(P: Vec3, N: Vec3): number {
    return this.intensity;
  }
}


export class PointLight extends Light {
  readonly position: Vec3;

  constructor(intensity: number, position: Vec3) {
    super('Point', intensity);
    this.position = position;
  }

  computeIllumination(P: Vec3, N: Vec3): number {
    const L = mathUtils.subtractVectors(this.position, P);
    const dot = mathUtils.dotVectors(L, N);

    if (dot < 0) // dont contribute negative light
      return 0;
    
    const scalarOnI = dot / (mathUtils.magnitude(L) * mathUtils.magnitude(N));
    return scalarOnI * this.intensity;
  }
}


export class DirectionalLight extends Light {
  readonly direction: Vec3;
  
  constructor(intensity: number, direction: Vec3) {
    super('Directional', intensity);
    this.direction = direction;
  }

  computeIllumination(P: Vec3, N: Vec3): number {
    const dot = mathUtils.dotVectors(N, this.direction);

    if (dot < 0) // dont contribute negative light 
      return 0; 

    const scalarOnI = dot / (mathUtils.magnitude(N) * mathUtils.magnitude(this.direction));
    return scalarOnI * this.intensity;
  }
}