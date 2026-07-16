import {Vec2, Vec3, SceneObject } from "./types.js";
import { CAMERA_POS } from "./constants.js";
import Scene from "./Scene.js";
import Sphere from "./Sphere.js";
import Camera from "./Camera.js";
import RenderTarget from "./RenderTarget";

class Controller {
  private scene: Scene;
  private camera: Camera;
  private renderTarget: RenderTarget;

  constructor(
    renderTarget: RenderTarget,
    scene: Scene,
    camera: Camera) {
      this.renderTarget = renderTarget;
      this.scene = scene;
      this.camera = camera;
  }

  render() {
    const cameraPos: Vec3 = this.camera.position;
    const renderW = this.renderTarget.width;
    const renderH = this.renderTarget.width;
    
    for (let x: number = -renderW/2; x <= renderW/2; x++) {
      for (let y: number = -renderH/2; y <= renderH/2; y++) {

        const D = this.camera.canvasToViewportCoord(renderW, renderH, x, y);

        const color = this.scene.traceRay(cameraPos, D, 1, Number.POSITIVE_INFINITY);

        const [putX, putY] = this.renderTarget.canvasCoordConversion(x,y);

        renderTarget.putPixel(putX, putY, color);
      }
    }    
  }
}

const sceneObjs: Array<SceneObject> = [
  new Sphere([0, -1, 3], 1, [255, 0, 0]),
  new Sphere([2, 0, 4], 1, [0, 0, 255]),
  new Sphere([-2, 0, 4], 1, [0, 255, 0])
];

const scene = new Scene(sceneObjs);
const camera = new Camera(CAMERA_POS);
const renderTarget = new RenderTarget();
const control = new Controller(renderTarget, scene, camera);

document.addEventListener("click", () => control.render());
