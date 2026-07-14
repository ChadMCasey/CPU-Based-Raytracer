import MathUtils from "./MathUtils";
import { CANVAS_DEFAULT_BACKGROUND, CAMERA_POS } from "./constants";
class Controller {
    constructor(canvas, twoDcontext, spheres) {
        this.viewportWidth = 1;
        this.viewportHeight = 1;
        this.viewportDistance = 1;
        this.mathUtils = new MathUtils();
        this.canvas = canvas;
        this.canvasW = canvas?.width || -1; // -1 indicates error
        this.canvasH = canvas?.height || -1;
        this.twoDContext = twoDcontext;
        this.spheres = spheres;
    }
    // x coordinate, y coordinate and color of the given pixel on the canvas
    putPixel(x, y, color) {
        this.twoDContext.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
        this.twoDContext.fillRect(x, y, 1, 1);
    }
    // coodinate system conversion to 2D cartesian plane
    canvasCoordConversion(Cx, Cy) {
        const Sx = this.canvasW / 2 + Cx;
        const Sy = this.canvasH / 2 - Cy;
        return [Sx, Sy];
    }
    canvasToViewportCoord(Cx, Cy) {
        const Vx = (this.viewportWidth / this.canvasW) * Cx;
        const Vy = (this.viewportHeight / this.canvasH) * Cy;
        const Vz = this.viewportDistance; // fixed viewport distance, for now.
        return [Vx, Vy, Vz];
    }
    ScaleColorVector(R, G, B, kScale) {
        const clampedR = Math.max(Math.min(R * kScale, 255), 0);
        const clampedG = Math.max(Math.min(G * kScale, 255), 0);
        const clampedB = Math.max(Math.min(B * kScale, 255), 0);
        return [clampedR, clampedG, clampedB];
    }
    // the ray equation
    computeRay(O, V, TScalar) {
        const D = this.mathUtils.subtractVectors(V, O);
        const Dscaled = this.mathUtils.scaleVector(D, TScalar);
        const ray = this.mathUtils.addVectors(O, Dscaled);
        return ray;
    }
    intersectRaySphere(O, D, sphere) {
        const r = sphere.radius;
        const CO = this.mathUtils.subtractVectors(O, sphere.center);
        const a = this.mathUtils.dotVectors(D, D);
        const b = 2 * this.mathUtils.dotVectors(CO, D);
        const c = this.mathUtils.dotVectors(CO, CO) - r * r;
        // at^2 +bt + c = 0 solution for t (ray intersection with sphere)
        const discriminantSquared = b ** 2 - 4 * a * c;
        // discriminant < 0 then no intersection
        if (discriminantSquared < 0)
            return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
        const discriminant = Math.sqrt(b ** 2 - 4 * a * c);
        // single intersection case: ray tangent to sphere
        return [(-b + discriminant) / (2 * a), (-b - discriminant) / (2 * a)];
    }
    // distance from C to point P on sphere
    distFromCenter(C, P) {
        const CMinusP = this.mathUtils.subtractVectors(C, P);
        const rSquared = this.mathUtils.dotVectors(CMinusP, CMinusP);
        return rSquared;
    }
    // compute the intersection of the ray with every sphere and 
    // return the color of the sphere at the nearest intersection
    // inside of some requested range t.
    traceRay(O, D, minT, maxT) {
        // create vars for closest t and sphere
        let closestT = Number.POSITIVE_INFINITY;
        let closestSphere = null;
        // iterate shapes in 3D scene
        for (let i = 0; i < this.spheres.length; i++) {
            const sphere = this.spheres[i];
            // check if the ray running from the origin through the viewport
            // intersects some object within the scene. In this context its a sphere
            const [t1, t2] = this.intersectRaySphere(O, D, sphere);
            // check if t1 is inbounds and see if its our closest intersection
            if ((t1 >= minT && t1 <= maxT) && t1 < closestT) {
                closestT = t1;
                closestSphere = sphere;
            }
            // check if t2 is inbounds and see if its our closest intersection
            if ((t2 >= minT && t2 <= maxT) && t2 < closestT) {
                closestT = t2;
                closestSphere = sphere;
            }
        }
        // no intersection > paint as the background color
        if (!closestSphere) {
            return CANVAS_DEFAULT_BACKGROUND;
        }
        return closestSphere.color;
    }
    render() {
        const canvasMinX = -this.canvasW / 2;
        const canvasMaxX = this.canvasW / 2;
        const canvasMinY = -this.canvasH / 2;
        const canvasMaxY = this.canvasH / 2;
        const O = CAMERA_POS;
        // iterate the entire 2D cartesian plane of our canvas
        for (let x = canvasMinX; x <= canvasMaxX; x++) {
            for (let y = canvasMinY; y <= canvasMaxY; y++) {
                // scale our canvas coordinates based on viewport dimensions
                const D = this.canvasToViewportCoord(x, y);
                // some compuatation
                const color = this.traceRay(O, D, 1, Number.POSITIVE_INFINITY);
                const [putX, putY] = this.canvasCoordConversion(x, y);
                this.putPixel(putX, putY, color);
            }
        }
    }
}
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const spheres = [
    {
        center: [0, -1, 3],
        radius: 1,
        color: [255, 0, 0] // RED
    },
    {
        center: [2, 0, 4],
        radius: 1,
        color: [0, 0, 255] // BLUE
    },
    {
        center: [-2, 0, 4],
        radius: 1,
        color: [0, 255, 0] // GREEN
    }
];
//  instantiate controller
const control = new Controller(canvas, context, spheres);
document.addEventListener("click", () => control.render());
