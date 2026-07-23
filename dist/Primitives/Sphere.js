import MathUtils from "../Utils/MathUtils.js";
const mathUtils = new MathUtils();
export default class Sphere {
    constructor(center, radius, color, specular, reflective) {
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.specular = specular;
        this.reflective = reflective;
    }
    intersect(O, D) {
        const r = this.radius;
        const CO = mathUtils.subtractVectors(O, this.center);
        const a = mathUtils.dotVectorsV3(D, D);
        const b = 2 * mathUtils.dotVectorsV3(CO, D);
        const c = mathUtils.dotVectorsV3(CO, CO) - r * r;
        const discriminantSquared = b ** 2 - 4 * a * c;
        if (discriminantSquared < 0)
            return null; // NO INTERSECTION
        const discriminant = Math.sqrt(b ** 2 - 4 * a * c);
        const intersections = [
            (-b + discriminant) / (2 * a),
            (-b - discriminant) / (2 * a),
        ];
        const validIntersections = intersections.filter((t) => t > 0);
        if (!validIntersections.length)
            return null;
        const distance = Math.min(...validIntersections);
        const position = mathUtils.addVectors(O, mathUtils.scaleVectorV3(D, distance)); // P = O + t(V - O);
        const normal = this.computeNormal(position);
        return { distance, position, normal };
    }
    computeNormal(position) {
        const CP = mathUtils.subtractVectors(position, this.center);
        const magnitude = mathUtils.magnitudeV3(CP);
        const normal = mathUtils.scaleVectorV3(CP, 1 / magnitude);
        return normal;
    }
}
