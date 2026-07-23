import { VALID_MOVEMENT_KEYS, CAMERA_MOVEMENT_SPEED, } from "../Configuration/constants.js";
import MathUtils from "../Utils/MathUtils.js";
// read user input and update application
export default class Controller {
    constructor(camera) {
        this.validMovementKeySet = new Set(VALID_MOVEMENT_KEYS);
        this.mathUtils = new MathUtils();
        this.keyPressedSet = new Set();
        this.camera = camera;
        // hookup event listeners
        this.addEventListeners();
    }
    addEventListeners() {
        document.addEventListener("keydown", (e) => {
            if (this.validMovementKeySet.has(e.key))
                this.keyPressedSet.add(e.key);
        });
        document.addEventListener("keyup", (e) => {
            if (this.validMovementKeySet.has(e.key))
                this.keyPressedSet.delete(e.key);
        });
    }
    update(elapsedMs) {
        let changeX = 0;
        let changeZ = 0;
        // accumulate change in position
        changeX += this.keyPressedSet.has("a") ? -1 : 0;
        changeX += this.keyPressedSet.has("d") ? 1 : 0;
        changeZ += this.keyPressedSet.has("s") ? -1 : 0;
        changeZ += this.keyPressedSet.has("w") ? 1 : 0;
        // compute magnitude of vector for change in camera position
        let movementVector = [changeX, changeZ];
        const movementMagnitude = this.mathUtils.magnitudeV2(movementVector);
        // the user is not moving at all
        if (movementMagnitude === 0)
            return;
        // create directional vector with magnitude 1
        movementVector = this.mathUtils.scaleVectorV2(movementVector, 1 / movementMagnitude);
        // normalize change in position based on time since last frame
        const Dx = (elapsedMs / 1000) * movementVector[0] * CAMERA_MOVEMENT_SPEED;
        const Dz = (elapsedMs / 1000) * movementVector[1] * CAMERA_MOVEMENT_SPEED;
        this.camera.updateCameraX(Dx);
        this.camera.updateCameraZ(Dz);
    }
}
