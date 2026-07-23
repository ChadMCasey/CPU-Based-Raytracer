import { Vec3 } from "../Configuration/types.js";
import { CAMERA_POS, MAX_REFLECT_RECUR } from "../Configuration/constants.js";
import Scene from "./Scene.js";
import Camera from "../Engine/Camera.js";
import RenderTarget from "../Engine/RenderTarget.js";

export default class Renderer {
  private scene: Scene;
  private camera: Camera;
  private renderTarget: RenderTarget;

  constructor(renderTarget: RenderTarget, scene: Scene, camera: Camera) {
    this.renderTarget = renderTarget;
    this.scene = scene;
    this.camera = camera;
  }

  render() {
    const cameraPos: Vec3 = this.camera.getCameraPosition();
    const cameraRotation: number[][] = this.camera.computeRotationMatrix();

    const renderW = this.renderTarget.width;
    const renderH = this.renderTarget.height;

    for (let x: number = -renderW / 2; x <= renderW / 2; x++) {
      for (let y: number = -renderH / 2; y <= renderH / 2; y++) {
        // determine directional vector D
        const D = this.camera.canvasToViewport(renderW, renderH, x, y);

        // rotate directional vector D via rotation matrix
        const rotatedD = this.camera.computeRotatedVector(cameraRotation, D);

        // notice that rotatedD originates at cameraPos here
        const color = this.scene.traceRay(
          cameraPos,
          rotatedD,
          1,
          Number.POSITIVE_INFINITY,
          MAX_REFLECT_RECUR,
        );

        // map back to JS canvas coordinate system
        const [putX, putY] = this.renderTarget.canvasCoordConversion(x, y);

        // paint cell accordingly
        this.renderTarget.putPixel(putX, putY, color);
      }
    }
  }
}
