import {
  convertDegToRad,
  computeRx,
  computeRy,
  computeRz,
  multiplyRotationalMatrices,
} from "../Utility/mathUtils";
import { Vec3, Camera } from "../Utility/types";
import {
  ASPECT_RATIO,
  CAMERA_ORIENTATION_SPEED,
  CAMERA_POS,
  CAMERA_ROTATION,
  CAMERA_ROTATION_MATRIX,
} from "../Utility/constants";

export const camera: Camera = {
  viewportDistance: 1,
  viewportHeight: 1,
  viewportWidth: 1 * ASPECT_RATIO(),
  position: CAMERA_POS,
  rotation: CAMERA_ROTATION,
  rotationMatrix: CAMERA_ROTATION_MATRIX,
  rotationChanged: false,
};

export function computeRotationMatrix(camera: Camera): number[][] {
  if (camera.rotationChanged) {
    // pitch yaw and roll of camera in radians
    const pitch: number = convertDegToRad(camera.rotation.pitch);
    const yaw: number = convertDegToRad(camera.rotation.yaw);
    const roll: number = convertDegToRad(camera.rotation.roll);

    // compute rotational matrices for rotation about each axis
    const Rx: number[][] = computeRx(pitch);
    const Ry: number[][] = computeRy(yaw);
    const Rz: number[][] = computeRz(roll);

    // produce the final orthonormal rotation matrix
    const RzRy: number[][] = multiplyRotationalMatrices(Rz, Ry);
    const RzRyRz: number[][] = multiplyRotationalMatrices(RzRy, Rx);

    camera.rotationChanged = false;
    camera.rotationMatrix = RzRyRz;
    return RzRyRz;
  }

  return camera.rotationMatrix; // cache hit
}

export function updateCameraX(camera: Camera, Dx: number): void {
  camera.position[0] += Dx;
}

export function updateCameraZ(camera: Camera, Dz: number): void {
  camera.position[2] += Dz;
}

export function updatePitch(camera: Camera, Dy: number): void {
  camera.rotation.pitch -= Dy * CAMERA_ORIENTATION_SPEED;
  camera.rotation.pitch = camera.rotation.pitch % 360;
  camera.rotationChanged = true;
}

export function updateYaw(camera: Camera, Dx: number): void {
  camera.rotation.yaw += Dx * CAMERA_ORIENTATION_SPEED;
  camera.rotation.yaw = camera.rotation.yaw % 360;
  camera.rotationChanged = true;
}

export function getCameraPosition(camera: Camera): Vec3 {
  return camera.position;
}
