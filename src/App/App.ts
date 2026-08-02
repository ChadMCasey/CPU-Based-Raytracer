import { CAMERA_POS } from "../Utility/constants";

// dependent services
import Renderer from "../Engine/Renderer";
import RenderTarget from "../Engine/RenderTarget";
import { sceneData } from "../Engine/Scene";
import Camera from "../Engine/Camera";
import Controller from "./Controller";
import Parallelize from "../Engine/Parallelize";

// the main app class, responsible for orchestrating the entire application
class App {
  private readonly renderTarget: RenderTarget;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly controller: Controller;
  private readonly parallelize: Parallelize;

  private lastTime: number = 0;

  constructor() {
    this.renderTarget = new RenderTarget();

    this.camera = new Camera(CAMERA_POS);
    this.parallelize = new Parallelize();
    this.controller = new Controller(this.camera, this.renderTarget);
    this.renderer = new Renderer(
      this.renderTarget,
      sceneData,
      this.camera,
      this.parallelize,
    );
  }

  async runAppLoop(currentTime: number): Promise<void> {
    // the scene responds to user input
    this.controller.update(currentTime - this.lastTime);

    this.lastTime = currentTime;

    // the scene can be drawn now
    await this.renderer.render();

    // loop continously
    window.requestAnimationFrame((currentTime) => this.runAppLoop(currentTime));
  }
}

// execute app
const app = new App();
window.requestAnimationFrame((currentTime) => app.runAppLoop(currentTime));
