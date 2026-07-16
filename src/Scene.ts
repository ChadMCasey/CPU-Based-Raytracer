import { Vec3, SceneObject, HitRecord, Light } from "./types.js";
import { CANVAS_DEFAULT_BACKGROUND } from "./constants.js";
import Sphere from "./Sphere.js";
import {AmbientLight, DirectionalLight, PointLight} from "./Light.js";

export default class Scene {
  
  private spheres: Sphere[] = [
    new Sphere([0, -1, 3], 1, [255, 0, 0]),
    new Sphere([2, 0, 4], 1, [0, 0, 255]),
    new Sphere([-2, 0, 4], 1, [0, 255, 0])
  ];
  
  private lights: Light[] = [
    new AmbientLight(0.2),
    new DirectionalLight(0.2, [1, 4, 4]),
    new PointLight(0.6, [2, 1, 0]),
  ];

  private sceneObjs: SceneObject[] = [...this.spheres];

  traceRay(O: Vec3, D: Vec3, minT: number, maxT: number) : Vec3 {
    let closestIntersection: number = Number.POSITIVE_INFINITY;
    let closestObj: SceneObject | null = null;

    for (let i = 0; i < this.sceneObjs.length; i++) {
      const sceneObj = this.sceneObjs[i];

      const intersection: HitRecord | null = sceneObj.intersect(O, D);    
      
      if (!intersection) continue;

      const distance = intersection.distance;
      if ((distance >= minT && distance <= maxT) && distance < closestIntersection) {
        closestIntersection = distance;
        closestObj = sceneObj;
      }
    }

    if (!closestObj) return CANVAS_DEFAULT_BACKGROUND;

    // we have intersected an object, we cant just render the given color
    // we must account for the lighting. Split out the traceRay method so the
    // logic is clean
    const intensity = this.computeLighting();

    return closestObj.color;
  }

  computeLighting() {}
}
