import { Vec3, Rotation } from "./types";
import MathUtils from "./MathUtils.js";

export default class Camera {
  private readonly mathUtils = new MathUtils();

  public readonly position: Vec3;
  public readonly viewportWidth: number = 1;
  public readonly viewportHeight: number = 1;
  public readonly viewportDistance: number = 1;
  
  // Pitch, Yaw and Roll in degrees
  public readonly rotation: Rotation = { pitch: 0, yaw: 0, roll: 0 };

  constructor(position: Vec3) {
    this.position = position; // starting position
  }

  // compute directional ray originating from origin (0,0,0)
  canvasToViewport(Cw: number, Ch: number, Cx: number, Cy: number): Vec3 {
    const Vx: number = (this.viewportWidth / Cw) * Cx;
    const Vy: number = (this.viewportHeight / Ch) * Cy;
    const Vz: number = this.viewportDistance;
    return [Vx, Vy, Vz];
  }

  computeRotationMatrix() {
    // pitch yaw and roll of camera in radians
    const pitch: number = this.mathUtils.convertDegToRad(this.rotation.pitch);
    const yaw: number = this.mathUtils.convertDegToRad(this.rotation.yaw);
    const roll: number = this.mathUtils.convertDegToRad(this.rotation.roll);

    // compute rotational matrices for rotation about each axis
    const Rx: number[][] = this.mathUtils.computeRx(pitch);
    const Ry: number[][] = this.mathUtils.computeRy(yaw);
    const Rz: number[][] = this.mathUtils.computeRz(roll);

    // produce the final orthonormal rotation matrix
    const RxRy: number[][] = this.mathUtils.multiplyRotationalMatrices(Rx, Ry);
    const RxRyRz: number[][] = this.mathUtils.multiplyRotationalMatrices(RxRy, Rz);

    // this captures the 3 transformations 
    return RxRyRz;
  }

  computeRotatedVector(R: number[][], D: Vec3) {
    return this.mathUtils.multiplyDirectionByRotation(R, D);
  }
}
