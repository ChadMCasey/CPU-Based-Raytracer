import MathUtils from "./MathUtils.js";
const mathUtils = new MathUtils();
export default class Sphere {
    constructor(center, radius, color) {
        this.center = center;
        this.radius = radius;
        this.color = color;
    }
    intersect(O, D) {
        const r = this.radius;
        const CO = mathUtils.subtractVectors(O, this.center);
        const a = mathUtils.dotVectors(D, D);
        const b = 2 * mathUtils.dotVectors(CO, D);
        const c = mathUtils.dotVectors(CO, CO) - r * r;
        const discriminantSquared = b ** 2 - 4 * a * c;
        if (discriminantSquared < 0)
            return null; // NO INTERSECTION
        const discriminant = Math.sqrt(b ** 2 - 4 * a * c);
        const intersections = [(-b + discriminant) / (2 * a), (-b - discriminant) / (2 * a)];
        const validIntersections = intersections.filter(t => t > 0);
        if (!validIntersections.length)
            return null;
        const distance = Math.min(...validIntersections);
        const position = mathUtils.addVectors(O, mathUtils.scaleVector(D, distance)); // P = O + t(V - O);
        const normal = this.computeNormal(position);
        return { distance, position, normal };
    }
    computeNormal(position) {
        const CP = mathUtils.subtractVectors(position, this.center);
        const magnitude = mathUtils.magnitude(CP);
        const normal = mathUtils.scaleVector(CP, 1 / magnitude);
        return normal;
    }
}
