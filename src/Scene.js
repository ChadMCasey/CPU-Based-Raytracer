import { CANVAS_DEFAULT_BACKGROUND } from "./constants.js";
import Sphere from "./Sphere.js";
export default class Scene {
    constructor() {
        this.sceneObjs = [
            new Sphere([0, -1, 3], 1, [255, 0, 0]),
            new Sphere([2, 0, 4], 1, [0, 0, 255]),
            new Sphere([-2, 0, 4], 1, [0, 255, 0])
        ];
    }
    traceRay(O, D, minT, maxT) {
        let closestIntersection = Number.POSITIVE_INFINITY;
        let closestObj = null;
        for (let i = 0; i < this.sceneObjs.length; i++) {
            const sceneObj = this.sceneObjs[i];
            const intersection = sceneObj.intersect(O, D);
            if (!intersection)
                continue;
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
