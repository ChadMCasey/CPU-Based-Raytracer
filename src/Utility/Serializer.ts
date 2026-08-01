import Camera from "../Engine/Camera";
import Light from "../Light/Light";
import {
  SceneObject,
  SerializedPrimative,
  SerializedLight,
  SerializedPayload,
  Vec3,
} from "./types";

// create a primiative representation of our 3D scene
export default class Serializer {
  serialize(
    camera: Camera,
    sceneObjs: SceneObject[],
    sceneLts: Light[],
  ): SerializedPayload {
    const [cameraPOS, cameraRotation] = this.serializeCamera(camera);
    const sceneObjects: SerializedPrimative[] =
      this.serializeSceneObjs(sceneObjs);
    const sceneLights: SerializedLight[] = this.serializeSceneLights(sceneLts);

    return {
      cameraPOS,
      cameraRotation,
      sceneObjects,
      sceneLights,
    };
  }

  // map camara position and rotation matrix
  serializeCamera(camera: Camera): [Vec3, number[][]] {
    const position: Vec3 = camera.getCameraPosition();
    const rotation: number[][] = camera.computeRotationMatrix();
    return [position, rotation];
  }

  // flat representation of scene objects
  serializeSceneObjs(SceneObjs: SceneObject[]): SerializedPrimative[] {
    return SceneObjs.map((o) => o.serialize());
  }

  serializeSceneLights(sceneLights: Light[]): SerializedLight[] {
    return sceneLights.map((l) => l.serialize());
  }
}
