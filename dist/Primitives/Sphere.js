import MathUtils from "../Utility/MathUtils.js";
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
        const CO = MathUtils.subtractVectors(O, this.center);
        const a = MathUtils.dotVectorsV3(D, D);
        const b = 2 * MathUtils.dotVectorsV3(CO, D);
        const c = MathUtils.dotVectorsV3(CO, CO) - r * r;
        const discriminantSquared = b ** 2 - 4 * a * c;
        if (discriminantSquared < 0)
            return null; // NO INTERSECTION
        const discriminant = Math.sqrt(b ** 2 - 4 * a * c);
        const intersections = [(-b + discriminant) / (2 * a), (-b - discriminant) / (2 * a)];
        const validIntersections = intersections.filter((t) => t > 0);
        if (!validIntersections.length)
            return null;
        const distance = Math.min(...validIntersections);
        const position = MathUtils.addVectors(O, MathUtils.scaleVectorV3(D, distance)); // P = O + t(V - O);
        const normal = this.computeNormal(position);
        return { distance, position, normal };
    }
    computeNormal(position) {
        const CP = MathUtils.subtractVectors(position, this.center);
        const magnitude = MathUtils.magnitudeV3(CP);
        const normal = MathUtils.scaleVectorV3(CP, 1 / magnitude);
        return normal;
    }
    serialize() {
        return {
            type: "sphere",
            center: this.center,
            radius: this.radius,
            color: this.color,
            specular: this.specular,
            reflective: this.reflective,
        };
    }
}
