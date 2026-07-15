import { CAMERA_POS } from "./constants";
import Scene from "./Scene";
import Sphere from "./Sphere";
class Controller {
    constructor(canvas, twoDcontext, scene) {
        this.viewportWidth = 1;
        this.viewportHeight = 1;
        this.viewportDistance = 1;
        this.canvas = canvas;
        this.canvasW = canvas?.width; // -1 indicates error
        this.canvasH = canvas?.height;
        this.twoDContext = twoDcontext;
        this.scene = scene;
    }
    // x coordinate, y coordinate and color of the given pixel on the canvas
    putPixel(x, y, color) {
        this.twoDContext.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
        this.twoDContext.fillRect(x, y, 1, 1);
    }
    // coodinate system conversion to 2D cartesian plane
    canvasCoordConversion(Cx, Cy) {
        const Sx = this.canvasW / 2 + Cx;
        const Sy = this.canvasH / 2 - Cy;
        return [Sx, Sy];
    }
    canvasToViewportCoord(Cx, Cy) {
        const Vx = (this.viewportWidth / this.canvasW) * Cx;
        const Vy = (this.viewportHeight / this.canvasH) * Cy;
        const Vz = this.viewportDistance; // fixed viewport distance, for now.
        return [Vx, Vy, Vz];
    }
    render() {
        const canvasMinX = -this.canvasW / 2;
        const canvasMaxX = this.canvasW / 2;
        const canvasMinY = -this.canvasH / 2;
        const canvasMaxY = this.canvasH / 2;
        const O = CAMERA_POS;
        for (let x = canvasMinX; x <= canvasMaxX; x++) {
            for (let y = canvasMinY; y <= canvasMaxY; y++) {
                const D = this.canvasToViewportCoord(x, y);
                const color = this.scene.traceRay(O, D, 1, Number.POSITIVE_INFINITY);
                const [putX, putY] = this.canvasCoordConversion(x, y);
                this.putPixel(putX, putY, color);
            }
        }
    }
}
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const sceneObjs = [
    new Sphere([0, -1, 3], 1, [255, 0, 0]),
    new Sphere([2, 0, 4], 1, [0, 0, 255]),
    new Sphere([-2, 0, 4], 1, [0, 255, 0])
];
const scene = new Scene(sceneObjs);
const control = new Controller(canvas, context, scene);
document.addEventListener("click", () => control.render());
