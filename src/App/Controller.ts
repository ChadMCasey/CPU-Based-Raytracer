import { Camera } from "../Utility/types";
import { updateYaw, updatePitch, updateCameraPosition } from "../Engine/Camera";
import { VALID_MOVEMENT_KEYS, CAMERA_MOVEMENT_SPEED } from "../Utility/constants";
import { Vec2, Vec3 } from "../Utility/types";
import { magnitudeV2, scaleVectorV2, scaleVectorV3, addVectors } from "../Utility/mathUtils";
import RenderTarget from "../Engine/RenderTarget";

// read user input and update application
export default class Controller {
  // camera movement
  public readonly keyPressedSet = new Set<string>();
  private readonly validMovementKeySet = new Set(VALID_MOVEMENT_KEYS);

  // camera orientation
  private cameraDx: number = 0;
  private cameraDy: number = 0;

  public readonly camera: Camera;
  public readonly renderTarget: RenderTarget;

  constructor(camera: Camera, renderTarget: RenderTarget) {
    this.camera = camera;
    this.renderTarget = renderTarget;

    // hookup event listeners
    this.addEventListeners();
  }

  update(elapsedMs: number) {
    this.updateCameraPosition(elapsedMs);
    this.updateCameraOrientation();
  }

  addEventListeners() {
    document.addEventListener("keydown", (e) => {
      if (this.validMovementKeySet.has(e.key)) this.keyPressedSet.add(e.key);
    });
    document.addEventListener("keyup", (e) => {
      if (this.validMovementKeySet.has(e.key)) this.keyPressedSet.delete(e.key);
    });
    document.addEventListener("click", () => {
      this.renderTarget.canvas.requestPointerLock();
      document.addEventListener("mousemove", (e) => {
        if (document.pointerLockElement === this.renderTarget.canvas) {
          this.cameraDx = e.movementX;
          this.cameraDy = e.movementY;
        }
      });
    });
  }

  updateCameraPosition(elapsedMs: number) {
    let changeX: number = 0;
    let changeZ: number = 0;

    // accumulate change in position
    changeX += this.keyPressedSet.has("a") ? -1 : 0;
    changeX += this.keyPressedSet.has("d") ? 1 : 0;
    changeZ += this.keyPressedSet.has("s") ? -1 : 0;
    changeZ += this.keyPressedSet.has("w") ? 1 : 0;

    // compute magnitude of vector for change in camera position
    let movementVector: Vec2 = [changeX, changeZ];
    const movementMagnitude: number = magnitudeV2(movementVector);

    // the user is not moving at all
    if (movementMagnitude === 0) return;

    // create directional vector with magnitude 1
    movementVector = scaleVectorV2(movementVector, 1 / movementMagnitude);

    // normalize change in position based on time since last frame
    const Dx = (elapsedMs / 1000) * movementVector[0] * CAMERA_MOVEMENT_SPEED;
    const Dz = (elapsedMs / 1000) * movementVector[1] * CAMERA_MOVEMENT_SPEED;
    const r: number[][] = this.camera.rotationMatrix;

    // grab directional vectors of the cameras rotation matrix
    const right: Vec3 = [r[0][0], r[1][0], r[2][0]];
    const forward: Vec3 = [r[0][2], r[1][2], r[2][2]];

    // scale the directional vectors by our Dx and Dz
    const scaleRight: Vec3 = scaleVectorV3(right, Dx);
    const scaleForward: Vec3 = scaleVectorV3(forward, Dz);

    // compute the total movement in this frame
    const movement: Vec3 = addVectors(scaleRight, scaleForward);

    this.camera.position = updateCameraPosition(this.camera.position, movement);
  }

  updateCameraOrientation() {
    // tell camera about the delta for pitch and yaw
    if (this.cameraDy !== 0) updatePitch(this.camera, this.cameraDy);
    if (this.cameraDx !== 0) updateYaw(this.camera, this.cameraDx);
    this.cameraDx = 0;
    this.cameraDy = 0;
  }
}
