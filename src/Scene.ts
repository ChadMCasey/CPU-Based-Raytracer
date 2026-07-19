import { Vec3, SceneObject, HitRecord, SceneIntersection } from "./types.js";
import { CANVAS_DEFAULT_BACKGROUND, MIN_T_FOR_SHADOW } from "./constants.js";
import Sphere from "./Sphere.js";
import MathUtils from "./MathUtils.js";
import Light from "./Light.js";
import AmbientLight from "./AmbientLight.js";
import DirectionalLight from "./DirectionalLight.js";
import PointLight from "./PointLight.js";

const mathUtils = new MathUtils();

export default class Scene {
  private spheres: Sphere[] = [
    new Sphere([0, -1, 3], 1, [255, 0, 0], 500, 0.2), // Red
    new Sphere([2, 0, 4], 1, [0, 0, 255], 500, 0.3), // Blue
    new Sphere([-2, 0, 4], 1, [0, 255, 0], 10, 0.4), // Green
    new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000, 0.5), // Yellow
  ];

  private lights: Light[] = [
    new AmbientLight(0.2),
    new DirectionalLight(0.2, [1, 4, 4]),
    new PointLight(0.6, [2, 1, 0]),
  ];

  private sceneObjs: SceneObject[] = [...this.spheres];

  traceRay(O: Vec3, D: Vec3, minT: number, maxT: number): Vec3 {
    // find the intersection between camera and closest scene object
    const intersection: SceneIntersection | null = this.closestIntersection(
      O,
      D,
      minT,
      maxT,
    );

    // apply lighting to the closest intersection to the camera
    if (intersection) {
      const lightIntensity = this.computeLighting(
        intersection.position,
        intersection.normal,
        mathUtils.scaleVector(D, -1),
        intersection.object.specular,
      );
      return mathUtils.scaleVector(intersection.object.color, lightIntensity);
    }

    // we have no intersection
    return CANVAS_DEFAULT_BACKGROUND;
  }

  closestIntersection(
    O: Vec3,
    D: Vec3,
    minT: number,
    maxT: number,
  ): SceneIntersection | null {
    let closestT: number = Number.POSITIVE_INFINITY;
    let closestHit: SceneIntersection | null = null;

    for (let i = 0; i < this.sceneObjs.length; i++) {
      const sceneObj = this.sceneObjs[i];

      const intersection: HitRecord | null = sceneObj.intersect(O, D);

      if (!intersection) continue;

      if (
        intersection.distance >= minT &&
        intersection.distance <= maxT &&
        intersection.distance < closestT
      ) {
        closestT = intersection.distance;
        closestHit = {
          distance: intersection.distance,
          position: intersection.position,
          normal: intersection.normal,
          object: sceneObj,
        };
      }
    }

    return closestHit;
  }

  computeLighting(P: Vec3, N: Vec3, V: Vec3, s: number) {
    let intensity: number = 0.0;

    for (let light of this.lights) {
      const shadowProps = light.getShadowProperties(P);

      // no shadow props, add ambient light as is
      if (!shadowProps) {
        intensity += light.computeIllumination(P, N, V, s);
        continue;
      }

      // do we have an intersection between us and the light?
      const [lightDirectionFromP, maxT] = shadowProps;
      const obstruction = this.closestIntersection(
        P,
        lightDirectionFromP,
        MIN_T_FOR_SHADOW,
        maxT,
      );

      // no intersection, means the light has made it to P unimpeded
      if (!obstruction) {
        intensity += light.computeIllumination(P, N, V, s);
      }
    }
    return intensity;
  }
}
