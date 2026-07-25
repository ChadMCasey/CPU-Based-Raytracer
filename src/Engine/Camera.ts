import MathUtils from "../Utils/MathUtils.js";
import { Vec3, Rotation } from "../Configuration/types.js";
import {
  ASPECT_RATIO,
  CAMERA_ORIENTATION_SPEED,
} from "../Configuration/constants.js";

export default class Camera {
  private readonly mathUtils = new MathUtils();

  private position: Vec3;
  public readonly viewportHeight: number;
  public readonly viewportDistance: number;

  // compute the viewport width based on aspect ratio
  public readonly viewportWidth = window.innerWidth / window.innerHeight;

  // Pitch, Yaw and Roll in degrees
  public readonly rotation: Rotation = { pitch: 0, yaw: 0, roll: 0 };

  constructor(position: Vec3) {
    this.position = position;

    // determine viewport size based off aspect ratio of browser
    this.viewportDistance = 1;
    this.viewportHeight = 1;
    this.viewportWidth = this.viewportHeight * ASPECT_RATIO();
  }

  // compute directional ray originating from origin (0,0,0)
  public canvasToViewport(
    Cw: number,
    Ch: number,
    Cx: number,
    Cy: number,
  ): Vec3 {
    const Vx: number = (this.viewportWidth / Cw) * Cx;
    const Vy: number = (this.viewportHeight / Ch) * Cy;
    const Vz: number = this.viewportDistance;
    return [Vx, Vy, Vz];
  }

  public computeRotationMatrix() {
    // pitch yaw and roll of camera in radians
    const pitch: number = this.mathUtils.convertDegToRad(this.rotation.pitch);
    const yaw: number = this.mathUtils.convertDegToRad(this.rotation.yaw);
    const roll: number = this.mathUtils.convertDegToRad(this.rotation.roll);

    // compute rotational matrices for rotation about each axis
    const Rx: number[][] = this.mathUtils.computeRx(pitch);
    const Ry: number[][] = this.mathUtils.computeRy(yaw);
    const Rz: number[][] = this.mathUtils.computeRz(roll);

    // produce the final orthonormal rotation matrix
    const RzRy: number[][] = this.mathUtils.multiplyRotationalMatrices(Rz, Ry);
    const RzRyRz: number[][] = this.mathUtils.multiplyRotationalMatrices(
      RzRy,
      Rx,
    );

    // this captures the 3 transformations
    return RzRyRz;
  }

  public computeRotatedVector(R: number[][], D: Vec3): Vec3 {
    return this.mathUtils.multiplyDirectionByRotation(R, D);
  }

  public updateCameraX(Dx: number): void {
    this.position[0] += Dx;
  }

  public updateCameraZ(Dz: number): void {
    this.position[2] += Dz;
  }

  public updatePitch(Dy: number): void {
    this.rotation.pitch -= Dy * CAMERA_ORIENTATION_SPEED;
  }

  public updateYaw(Dx: number): void {
    this.rotation.yaw += Dx * CAMERA_ORIENTATION_SPEED;
  }

  public getCameraPosition(): Vec3 {
    return this.position;
  }
}
