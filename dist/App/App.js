import { CAMERA_POS } from "../Utility/constants.js";
// dependent services
import Renderer from "../Engine/Renderer.js";
import RenderTarget from "../Engine/RenderTarget.js";
import Scene from "../Engine/Scene.js";
import Camera from "../Engine/Camera.js";
import Controller from "./Controller.js";
// the main app class, responsible for orchestrating the entire application
class App {
    constructor() {
        this.lastTime = 0;
        this.renderTarget = new RenderTarget();
        this.scene = new Scene();
        this.camera = new Camera(CAMERA_POS);
        this.renderer = new Renderer(this.renderTarget, this.scene, this.camera);
        this.controller = new Controller(this.camera, this.renderTarget);
    }
    runAppLoop(currentTime) {
        // the scene responds to user input
        this.controller.update(currentTime - this.lastTime);
        this.lastTime = currentTime;
        // the scene can be drawn now
        this.renderer.render(this.camera.computeRotationMatrix());
        // loop continously
        window.requestAnimationFrame((currentTime) => this.runAppLoop(currentTime));
    }
}
// execute app
const app = new App();
window.requestAnimationFrame((currentTime) => app.runAppLoop(currentTime));
