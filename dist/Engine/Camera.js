import MathUtils from "../Utils/MathUtils.js";
import { ASPECT_RATIO, CAMERA_ORIENTATION_SPEED, CAMERA_ORIENTATION, } from "../Configuration/constants.js";
export default class Camera {
    constructor(position) {
        this.mathUtils = new MathUtils();
        // compute the viewport width based on aspect ratio
        this.viewportWidth = window.innerWidth / window.innerHeight;
        // Pitch, Yaw and Roll in degrees
        this.rotation = { pitch: 0, yaw: 0, roll: 0 };
        this.cachedRotationMatrix = CAMERA_ORIENTATION;
        this.rotationChanged = false; // cache flag
        this.position = position;
        // determine viewport size based off aspect ratio of browser
        this.viewportDistance = 1;
        this.viewportHeight = 1;
        this.viewportWidth = this.viewportHeight * ASPECT_RATIO();
    }
    // compute directional ray originating from origin (0,0,0)
    canvasToViewport(Cw, Ch, Cx, Cy) {
        const Vx = (this.viewportWidth / Cw) * Cx;
        const Vy = (this.viewportHeight / Ch) * Cy;
        const Vz = this.viewportDistance;
        return [Vx, Vy, Vz];
    }
    computeRotationMatrix() {
        if (this.rotationChanged) {
            // pitch yaw and roll of camera in radians
            const pitch = this.mathUtils.convertDegToRad(this.rotation.pitch);
            const yaw = this.mathUtils.convertDegToRad(this.rotation.yaw);
            const roll = this.mathUtils.convertDegToRad(this.rotation.roll);
            // compute rotational matrices for rotation about each axis
            const Rx = this.mathUtils.computeRx(pitch);
            const Ry = this.mathUtils.computeRy(yaw);
            const Rz = this.mathUtils.computeRz(roll);
            // produce the final orthonormal rotation matrix
            const RzRy = this.mathUtils.multiplyRotationalMatrices(Rz, Ry);
            const RzRyRz = this.mathUtils.multiplyRotationalMatrices(RzRy, Rx);
            this.cachedRotationMatrix = RzRyRz;
            this.rotationChanged = false;
            return RzRyRz;
        }
        return this.cachedRotationMatrix; // cache hit
    }
    computeRotatedVector(R, D) {
        return this.mathUtils.multiplyDirectionByRotation(R, D);
    }
    updateCameraX(Dx) {
        this.position[0] += Dx;
    }
    updateCameraZ(Dz) {
        this.position[2] += Dz;
    }
    updatePitch(Dy) {
        this.rotation.pitch -= Dy * CAMERA_ORIENTATION_SPEED;
        this.rotation.pitch = this.rotation.pitch % 360;
        this.rotationChanged = true;
    }
    updateYaw(Dx) {
        this.rotation.yaw += Dx * CAMERA_ORIENTATION_SPEED;
        this.rotation.yaw = this.rotation.yaw % 360;
        console.log(`Yaw: ${this.rotation.yaw}`);
        this.rotationChanged = true;
    }
    getCameraPosition() {
        return this.position;
    }
}
