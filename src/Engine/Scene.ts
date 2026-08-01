import { SceneObject } from "../Utility/types";
import Sphere from "../Primitives/Sphere";
import Light from "../Light/Light";
import AmbientLight from "../Light/AmbientLight";
import DirectionalLight from "../Light/DirectionalLight";
import PointLight from "../Light/PointLight";

export default class Scene {
  private spheres: Sphere[] = [
    new Sphere([0, -1, 3], 1, [255, 0, 0], 500, 0.2), // Red
    new Sphere([2, 0, 4], 1, [0, 0, 255], 500, 0.3), // Blue
    new Sphere([-2, 0, 4], 1, [0, 255, 0], 10, 0.4), // Green
    new Sphere([0, -5001, 0], 5000, [255, 255, 255], 1000, 0.5), // white
  ];

  public readonly lights: Light[] = [
    new AmbientLight(0.2, [255, 255, 255]),
    new DirectionalLight(0.2, [1, 4, 4], [255, 255, 255]),
    new PointLight(0.6, [2, 1, 0], [255, 255, 255]),
  ];

  public readonly sceneObjs: SceneObject[] = [...this.spheres];
}
