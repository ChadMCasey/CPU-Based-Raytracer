import { Vec3, SceneObject, HitRecord } from "./types.js";
import { CANVAS_DEFAULT_BACKGROUND } from "./constants";

export default class Scene {
  private sceneObjs: SceneObject[];

  constructor(sceneObjs: SceneObject[]) {
    this.sceneObjs = sceneObjs;
  }

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

    if (!closestObj) {
      return CANVAS_DEFAULT_BACKGROUND;
    }

    return closestObj.color;
  }
}