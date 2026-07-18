import Light  from './Light.js';
import { Vec3 } from './types.js';

export default class AmbientLight extends Light {
  constructor(intensity: number) {
    super('Ambient', intensity);
  }

  computeIllumination(P: Vec3, N: Vec3, V: Vec3, s: number): number {
    return this.intensity;
  }
}