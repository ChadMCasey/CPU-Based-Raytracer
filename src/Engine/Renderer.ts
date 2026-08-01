import Scene from "./Scene";
import Camera from "../Engine/Camera";
import RenderTarget from "../Engine/RenderTarget";
import Serializer from "../Utility/Serializer";
import Parallelize from "./Parallelize";
import { BANDS } from "../Utility/constants";

export default class Renderer {
  private scene: Scene;
  private camera: Camera;
  private renderTarget: RenderTarget;
  private serializer: Serializer;
  private parallelize: Parallelize;

  constructor(
    renderTarget: RenderTarget,
    scene: Scene,
    camera: Camera,
    serializer: Serializer,
    parallel: Parallelize,
  ) {
    this.renderTarget = renderTarget;
    this.scene = scene;
    this.camera = camera;
    this.serializer = serializer;
    this.parallelize = parallel;
  }

  async render(): Promise<void> {
    // serialize our world for this frame
    const serializedScene = this.serializer.serialize(
      this.camera,
      this.scene.sceneObjs,
      this.scene.lights,
    );

    // task creation is handled inside the the parallel class
    await this.parallelize.renderFrame(
      this.renderTarget.width,
      this.renderTarget.height,
      this.camera.viewportWidth,
      this.camera.viewportHeight,
      BANDS,
      serializedScene,
      this.renderTarget.sharedArrayBuffer,
      this.renderTarget.updateScreen,
    );
  }
}
