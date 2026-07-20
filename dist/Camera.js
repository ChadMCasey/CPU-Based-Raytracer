import MathUtils from "./MathUtils.js";
export default class Camera {
    constructor(position) {
        this.mathUtils = new MathUtils();
        this.viewportWidth = 1;
        this.viewportHeight = 1;
        this.viewportDistance = 1;
        // Pitch, Yaw and Roll in degrees
        this.rotation = { pitch: -20, yaw: 0, roll: 0 };
        this.position = position; // starting position
    }
    // compute directional ray originating from origin (0,0,0)
    canvasToViewport(Cw, Ch, Cx, Cy) {
        const Vx = (this.viewportWidth / Cw) * Cx;
        const Vy = (this.viewportHeight / Ch) * Cy;
        const Vz = this.viewportDistance;
        return [Vx, Vy, Vz];
    }
    computeRotationMatrix() {
        // pitch yaw and roll of camera in radians
        const pitch = this.mathUtils.convertDegToRad(this.rotation.pitch);
        const yaw = this.mathUtils.convertDegToRad(this.rotation.yaw);
        const roll = this.mathUtils.convertDegToRad(this.rotation.roll);
        // compute rotational matrices for rotation about each axis
        const Rx = this.mathUtils.computeRx(pitch);
        const Ry = this.mathUtils.computeRy(yaw);
        const Rz = this.mathUtils.computeRz(roll);
        // produce the final orthonormal rotation matrix
        const RxRy = this.mathUtils.multiplyRotationalMatrices(Rx, Ry);
        const RxRyRz = this.mathUtils.multiplyRotationalMatrices(RxRy, Rz);
        // this captures the 3 transformations 
        return RxRyRz;
    }
    computeRotatedVector(R, D) {
        return this.mathUtils.multiplyDirectionByRotation(R, D);
    }
}
