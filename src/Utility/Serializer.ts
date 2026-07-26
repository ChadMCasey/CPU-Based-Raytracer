import Camera from "../Engine/Camera";
import Light from "../Light/Light";
import { SceneObject, SerializedPrimative, SerializedLight } from "./types";

// create a primiative representation of our 3D scene
export class Serializer {
  serialize(camera: Camera, sceneObjs: SceneObject[], sceneLights: Light[]) {
    const [cameraPOS, cameraRotation] = this.serializeCamera(camera);
    const serializedSceneObjs = this.serializeSceneObjs(sceneObjs);
    const serializedLights = this.serializeSceneLights(sceneLights);

    return {
      cameraPOS,
      cameraRotation,
      serializedSceneObjs,
      serializedLights,
    };
  }

  // map camara position and rotation matrix
  serializeCamera(camera: Camera) {
    const position: number[] = camera.getCameraPosition();
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
