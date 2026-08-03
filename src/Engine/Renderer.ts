import { SceneData, Vec3, ScenePayload, Camera } from "../Utility/types";
import RenderTarget from "../Engine/RenderTarget";
import Parallelize from "./Parallelize";
import { BANDS } from "../Utility/constants";
import { getCameraPosition, computeRotationMatrix } from "./Camera";

export default class Renderer {
  private sceneData: SceneData;
  private camera: Camera;
  private renderTarget: RenderTarget;
  private parallelize: Parallelize;

  constructor(renderTarget: RenderTarget, sceneData: SceneData, camera: Camera, parallel: Parallelize) {
    this.renderTarget = renderTarget;
    this.sceneData = sceneData;
    this.camera = camera;
    this.parallelize = parallel;
  }

  async render(): Promise<void> {
    // serialize our world for this frame
    const cameraPOS: Vec3 = getCameraPosition(this.camera);
    const cameraRotation: number[][] = computeRotationMatrix(this.camera);
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
