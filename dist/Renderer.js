import { CAMERA_POS } from "./constants.js";
import Scene from "./Scene.js";
import Camera from "./Camera.js";
import RenderTarget from "./RenderTarget.js";
class Controller {
    constructor(renderTarget, scene, camera) {
        this.renderTarget = renderTarget;
        this.scene = scene;
        this.camera = camera;
    }
    render() {
        const cameraPos = this.camera.position;
        const cameraRotation = this.camera.computeRotationMatrix();
        const renderW = this.renderTarget.width;
        const renderH = this.renderTarget.height;
        for (let x = -renderW / 2; x <= renderW / 2; x++) {
            for (let y = -renderH / 2; y <= renderH / 2; y++) {
                // determine directional vector D
                const D = this.camera.canvasToViewport(renderW, renderH, x, y);
                // rotate directional vector D via rotation matrix
                const rotatedD = this.camera.computeRotatedVector(cameraRotation, D);
                // notice that rotatedD originates at cameraPos here
                const color = this.scene.traceRay(cameraPos, rotatedD, 1, Number.POSITIVE_INFINITY);
                // map back to JS canvas coordinate system
                const [putX, putY] = this.renderTarget.canvasCoordConversion(x, y);
                // paint cell accordingly
                this.renderTarget.putPixel(putX, putY, color);
            }
        }
    }
}
const scene = new Scene();
const camera = new Camera(CAMERA_POS);
const renderTarget = new RenderTarget();
const control = new Controller(renderTarget, scene, camera);
document.addEventListener("click", () => control.render());
