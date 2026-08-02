import { SceneData, Vec3, ScenePayload } from "../Utility/types";
import Camera from "../Engine/Camera";
import RenderTarget from "../Engine/RenderTarget";
import Parallelize from "./Parallelize";
import { BANDS } from "../Utility/constants";

export default class Renderer {
  private sceneData: SceneData;
  private camera: Camera;
  private renderTarget: RenderTarget;
  private parallelize: Parallelize;

  constructor(
    renderTarget: RenderTarget,
    sceneData: SceneData,
    camera: Camera,
    parallel: Parallelize,
  ) {
    this.renderTarget = renderTarget;
    this.sceneData = sceneData;
    this.camera = camera;
    this.parallelize = parallel;
  }

  async render(): Promise<void> {
    // serialize our world for this frame
    const cameraPOS: Vec3 = this.camera.getCameraPosition();
    const cameraRotation: number[][] = this.camera.computeRotationMatrix();
    const sceneData = this.sceneData;

    const scenePayload: ScenePayload = { sceneData, cameraPOS, cameraRotation };

    // task creation is handled inside the the parallel class
    await this.parallelize.renderFrame(
      this.renderTarget.width,
      this.renderTarget.height,
      this.camera.viewportWidth,
      this.camera.viewportHeight,
      BANDS,
      scenePayload,
      this.renderTarget.sharedArrayBuffer,
      this.renderTarget.updateScreen,
    );
  }
}
