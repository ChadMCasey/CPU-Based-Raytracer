import { CAMERA_POS } from "../Configuration/constants.js";

// dependent services
import Renderer from "../Engine/Renderer.js";
import RenderTarget from "../Engine/RenderTarget.js";
import Scene from "../Engine/Scene.js";
import Camera from "../Engine/Camera.js";
import Controller from "./Controller.js";

// the main app class, responsible for orchestrating the entire application
class App {
  private readonly renderTarget: RenderTarget;
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly controller: Controller;

  private lastTime: number = 0;

  constructor() {
    this.renderTarget = new RenderTarget();
    this.scene = new Scene();
    this.camera = new Camera(CAMERA_POS);
    this.renderer = new Renderer(this.renderTarget, this.scene, this.camera);
    this.controller = new Controller(this.camera);
  }

  runAppLoop(currentTime: number): void {
    // the scene responds to user input
    this.controller.update(currentTime - this.lastTime);

    this.lastTime = currentTime;

    // the scene can be drawn now
    this.renderer.render();

    // loop continously
    window.requestAnimationFrame((currentTime) => this.runAppLoop(currentTime));
  }
}

// execute app
const app = new App();
window.requestAnimationFrame((currentTime) => app.runAppLoop(currentTime));
