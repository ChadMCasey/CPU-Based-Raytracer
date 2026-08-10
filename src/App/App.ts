// dependent services
import Renderer from "../Engine/Renderer";
import RenderTarget from "../Engine/RenderTarget";
import Controller from "./Controller";
import Parallelize from "../Engine/Parallelize";
import UIManager from "./UIManager";
import { sceneData } from "../Engine/Scene";
import { camera } from "../Engine/Camera";
import { Camera } from "../Utility/types";

// the main app class, responsible for orchestrating the entire application
class App {
  private readonly renderTarget: RenderTarget;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly controller: Controller;
  private readonly parallelize: Parallelize;
  private readonly uiManager: UIManager;

  private lastFrame: number = 0;

  constructor(camera: Camera) {
    this.camera = camera;
    this.renderTarget = new RenderTarget();
    this.parallelize = new Parallelize();
    this.controller = new Controller(this.camera, this.renderTarget);
    this.uiManager = new UIManager();
    this.renderer = new Renderer(this.renderTarget, sceneData, this.camera, this.parallelize);
  }

  async runAppLoop(currentTime: number): Promise<void> {
    // the time since last frame should be 0 for the first frame
    const msFrameDelta = this.lastFrame === 0 ? 0 : currentTime - this.lastFrame;

    this.lastFrame = currentTime;

    // the scene can be drawn now - respond to debug from user input
    await this.renderer.render(this.controller.debugFlag);

    // controller handles user input & orchestrates with scene
    this.controller.update(msFrameDelta);

    // the UI manager is an abstraction that communicates with our UI layer
    this.uiManager.update(msFrameDelta);

    // loop continously
    window.requestAnimationFrame((currentTime) => this.runAppLoop(currentTime));
  }
}

// execute app
const app = new App(camera);
window.requestAnimationFrame((currentTime) => app.runAppLoop(currentTime));
