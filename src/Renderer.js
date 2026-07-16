import { CAMERA_POS } from "./constants.js";
import Scene from "./Scene.js";
import Sphere from "./Sphere.js";
import Camera from "./Camera.js";
import RenderTarget from "./RenderTarget";
class Controller {
    constructor(renderTarget, scene, camera) {
        this.renderTarget = renderTarget;
        this.scene = scene;
        this.camera = camera;
    }
    render() {
        const cameraPos = this.camera.position;
        const renderW = this.renderTarget.width;
        const renderH = this.renderTarget.width;
        for (let x = -renderW / 2; x <= renderW / 2; x++) {
            for (let y = -renderH / 2; y <= renderH / 2; y++) {
                const D = this.camera.canvasToViewportCoord(renderW, renderH, x, y);
                const color = this.scene.traceRay(cameraPos, D, 1, Number.POSITIVE_INFINITY);
                const [putX, putY] = this.renderTarget.canvasCoordConversion(x, y);
                renderTarget.putPixel(putX, putY, color);
            }
        }
    }
}
const sceneObjs = [
    new Sphere([0, -1, 3], 1, [255, 0, 0]),
    new Sphere([2, 0, 4], 1, [0, 0, 255]),
    new Sphere([-2, 0, 4], 1, [0, 255, 0])
];
const scene = new Scene(sceneObjs);
const camera = new Camera(CAMERA_POS);
const renderTarget = new RenderTarget();
const control = new Controller(renderTarget, scene, camera);
document.addEventListener("click", () => control.render());
