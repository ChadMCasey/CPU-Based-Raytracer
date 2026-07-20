import { CAMERA_POS, MAX_REFLECT_RECUR } from "../Configuration/constants.js";
import Scene from "./Scene.js";
import Camera from "../Engine/Camera.js";
import RenderTarget from "../Engine/RenderTarget.js";
class Controller {
    constructor(renderTarget, scene, camera) {
        this.renderTarget = renderTarget;
        this.scene = scene;
        this.camera = camera;
    }
    render() {
        const cameraPos = this.camera.position;
        const renderW = this.renderTarget.width;
        const renderH = this.renderTarget.height;
        for (let x = -renderW / 2; x <= renderW / 2; x++) {
            for (let y = -renderH / 2; y <= renderH / 2; y++) {
                const D = this.camera.canvasToViewportCoord(renderW, renderH, x, y);
                const color = this.scene.traceRay(cameraPos, D, 1, Number.POSITIVE_INFINITY, MAX_REFLECT_RECUR);
                const [putX, putY] = this.renderTarget.canvasCoordConversion(x, y);
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
