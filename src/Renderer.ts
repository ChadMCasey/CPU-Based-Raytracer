import {Vec2, Vec3, SceneObject } from "./types.js";
import { CAMERA_POS } from "./constants.js";
import Scene from "./Scene.js";
import Sphere from "./Sphere.js";

class Controller {
  private viewportWidth: number = 1;
  private viewportHeight: number = 1;
  private viewportDistance: number = 1;
  private canvasW: number;
  private canvasH: number;
  private twoDContext: CanvasRenderingContext2D;
  private scene: Scene;
  
  constructor(
    canvas: HTMLCanvasElement, 
    twoDcontext: CanvasRenderingContext2D, 
    scene: Scene) {
      this.canvasW = canvas?.width; // -1 indicates error
      this.canvasH = canvas?.height;
      this.twoDContext = twoDcontext
      this.scene = scene;
  }

  // x coordinate, y coordinate and color of the given pixel on the canvas
  putPixel(x: number, y:number, color: Vec3): void {
    this.twoDContext.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
    this.twoDContext.fillRect(x, y, 1, 1);
  }

  // coodinate system conversion to 2D cartesian plane
  canvasCoordConversion(Cx: number, Cy: number): Vec2 {
    const Sx: number = this.canvasW/2 + Cx;
    const Sy: number = this.canvasH/2 - Cy;
    return [Sx, Sy];
  } 

  canvasToViewportCoord(Cx: number, Cy: number): Vec3 {
    const Vx: number = (this.viewportWidth / this.canvasW) * Cx;
    const Vy: number = (this.viewportHeight / this.canvasH ) * Cy;
    const Vz: number = this.viewportDistance; // fixed viewport distance, for now.
    return [Vx, Vy, Vz];
  }

  render() {
    const O: Vec3 = CAMERA_POS;
    
    for (let x: number = -this.canvasW/2; x <= this.canvasW/2; x++) {
      for (let y: number = -this.canvasH/2; y <= this.canvasH/2; y++) {
        const D = this.canvasToViewportCoord(x, y);
        const color = this.scene.traceRay(O, D, 1, Number.POSITIVE_INFINITY);
        const [putX, putY] = this.canvasCoordConversion(x,y);
        this.putPixel(putX, putY, color);
      }
    }    
  }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const sceneObjs: Array<SceneObject> = [
  new Sphere([0, -1, 3], 1, [255, 0, 0]),
  new Sphere([2, 0, 4], 1, [0, 0, 255]),
  new Sphere([-2, 0, 4], 1, [0, 255, 0])
];

const scene = new Scene(sceneObjs);
const control = new Controller(canvas, context, scene);

document.addEventListener("click", () => control.render());
