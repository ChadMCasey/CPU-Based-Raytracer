import { CANVAS_DEFAULT_BACKGROUND } from "./constants";
export default class Scene {
    constructor(sceneObjs) {
        this.sceneObjs = sceneObjs;
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
