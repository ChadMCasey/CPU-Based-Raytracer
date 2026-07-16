import { Light, Vec3 } from "./types.js";


export class DirectionalLight implements Light {
  readonly intensity: number;
  readonly type = "directional";
  readonly direction: Vec3;

  constructor(intensity: number, direction: Vec3) {
    this.intensity = intensity;
    this.direction = direction;
  }
}


export class PointLight implements Light {
  readonly intensity: number;
  readonly type = "point";
  readonly position: Vec3;

  constructor(intensity: number, position: Vec3) {
    this.intensity = intensity;
    this.position = position;
  }
}


export class AmbientLight implements Light {
  readonly intensity: number;
  readonly type = "ambient";

  constructor(intensity: number) {
    this.intensity = intensity;
  }
}