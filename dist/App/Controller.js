// read user input and update application
export default class Controller {
    constructor(camera) {
        this.keyPressedSet = new Set();
        this.camera = camera;
        // hookup event listeners
        this.addEventListeners();
    }
    addEventListeners() {
        document.addEventListener("keydown", (e) => this.keyPressedSet.add(e.key));
        document.addEventListener("keyup", (e) => this.keyPressedSet.delete(e.key));
    }
    update() {
        // move the camera according to user input
        this.changeCameraPosition();
    }
    changeCameraPosition() {
        if (this.keyPressedSet.has("a"))
            this.camera.updateCameraX(-0.1);
        if (this.keyPressedSet.has("d"))
            this.camera.updateCameraX(0.1);
        if (this.keyPressedSet.has("w"))
            this.camera.updateCameraZ(0.1);
        if (this.keyPressedSet.has("s"))
            this.camera.updateCameraZ(-0.1);
    }
}
