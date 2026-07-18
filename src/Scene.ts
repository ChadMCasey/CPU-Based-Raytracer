import { Vec3, SceneObject, HitRecord } from "./types.js";
import { CANVAS_DEFAULT_BACKGROUND } from "./constants.js";
import Sphere from "./Sphere.js";
import {AmbientLight, DirectionalLight, PointLight, Light } from "./Light.js";
import MathUtils from "./MathUtils.js";

const mathUtils = new MathUtils();

export default class Scene {
  
  private spheres: Sphere[] = [
    new Sphere([0, -1, 3], 1, [255, 0, 0], 500), // Red
    new Sphere([2, 0, 4], 1, [0, 0, 255], 500), // Blue
    new Sphere([-2, 0, 4], 1, [0, 255, 0], 10), // Green
    new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000) // Yellow
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
    let closestP: Vec3 | null = null;
    let normalAtP: Vec3 | null = null;

    for (let i = 0; i < this.sceneObjs.length; i++) {
      const sceneObj = this.sceneObjs[i];

      const intersection: HitRecord | null = sceneObj.intersect(O, D);    
      
      if (!intersection) continue;

      if ((intersection.distance >= minT && 
           intersection.distance <= maxT) && 
           intersection.distance < closestIntersection) {
        closestIntersection = intersection.distance;
        closestP = intersection.position;
        normalAtP = intersection.normal;
        closestObj = sceneObj;
      }
    }

    // we have an intersection at P
    if (closestObj && closestP && normalAtP) {
      const lightIntensity = this.computeLighting(
        closestP, 
        normalAtP, 
        mathUtils.subtractVectors(O, closestP), 
        closestObj.specular);
      return mathUtils.scaleVector(closestObj.color, lightIntensity);
    } 

    // we have no intersection
    return CANVAS_DEFAULT_BACKGROUND;
  }

  computeLighting(P: Vec3, N: Vec3, V: Vec3, s: number) {
    let intensity: number = 0.0;
    for (let light of this.lights) 
      intensity += light.computeIllumination(P, N, V, s);
    return intensity;
  }
}
