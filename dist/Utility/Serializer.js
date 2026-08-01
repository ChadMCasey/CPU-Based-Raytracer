// create a primiative representation of our 3D scene
export class Serializer {
    serialize(camera, sceneObjs, sceneLts) {
        const [cameraPOS, cameraRotation] = this.serializeCamera(camera);
        const sceneObjects = this.serializeSceneObjs(sceneObjs);
        const sceneLights = this.serializeSceneLights(sceneLts);
        return {
            cameraPOS,
            cameraRotation,
            sceneObjects,
            sceneLights,
        };
    }
    // map camara position and rotation matrix
    serializeCamera(camera) {
        const position = camera.getCameraPosition();
        const rotation = camera.computeRotationMatrix();
        return [position, rotation];
    }
    // flat representation of scene objects
    serializeSceneObjs(SceneObjs) {
        return SceneObjs.map((o) => o.serialize());
    }
    serializeSceneLights(sceneLights) {
        return sceneLights.map((l) => l.serialize());
    }
}
