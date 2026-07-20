import { Vec3 } from "../Configuration/types";

export default class Camera {
  public readonly position: Vec3;
  public readonly viewportWidth: number = 1;
  public readonly viewportHeight: number = 1;
  public readonly viewportDistance: number = 1;

  constructor(position: Vec3) {
    this.position = position; // starting position.
  }

  // i am looking at a 2D coordinate, please provide me a three dimensional direction ray
  canvasToViewportCoord(Cw: number, Ch: number, Cx: number, Cy: number): Vec3 {
    const Vx: number = (this.viewportWidth / Cw) * Cx;
    const Vy: number = (this.viewportHeight / Ch) * Cy;
    const Vz: number = this.viewportDistance;
    return [Vx, Vy, Vz];
  }
}
