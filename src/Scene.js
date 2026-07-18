import { CANVAS_DEFAULT_BACKGROUND } from "./constants.js";
import Sphere from "./Sphere.js";
import { AmbientLight, DirectionalLight, PointLight } from "./Light.js";
import MathUtils from "./MathUtils.js";
const mathUtils = new MathUtils();
export default class Scene {
    constructor() {
        this.spheres = [
            new Sphere([0, -1, 3], 1, [255, 0, 0], 500), // Red
            new Sphere([2, 0, 4], 1, [0, 0, 255], 500), // Blue
            new Sphere([-2, 0, 4], 1, [0, 255, 0], 10), // Green
            new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000) // Yellow
        ];
        this.lights = [
            new AmbientLight(0.2),
            new DirectionalLight(0.2, [1, 4, 4]),
            new PointLight(0.6, [2, 1, 0]),
        ];
        this.sceneObjs = [...this.spheres];
    }
    traceRay(O, D, minT, maxT) {
        let closestIntersection = Number.POSITIVE_INFINITY;
        let closestObj = null;
        let closestP = null;
        let normalAtP = null;
        for (let i = 0; i < this.sceneObjs.length; i++) {
            const sceneObj = this.sceneObjs[i];
            const intersection = sceneObj.intersect(O, D);
            if (!intersection)
                continue;
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
            const lightIntensity = this.computeLighting(closestP, normalAtP, mathUtils.subtractVectors(O, closestP), closestObj.specular);
            return mathUtils.scaleVector(closestObj.color, lightIntensity);
        }
        // we have no intersection
        return CANVAS_DEFAULT_BACKGROUND;
    }
    computeLighting(P, N, V, s) {
        let intensity = 0.0;
        for (let light of this.lights)
            intensity += light.computeIllumination(P, N, V, s);
        return intensity;
    }
}
