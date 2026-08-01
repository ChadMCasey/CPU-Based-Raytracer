import {
  SceneObject,
  HitRecord,
  Vec3,
  RGB,
  SerializedSphere,
} from "../Utility/types";
import MathUtils from "../Utility/MathUtils";

export default class Sphere implements SceneObject {
  private center: Vec3;
  private radius: number;
  public readonly color: RGB;
  public readonly specular: number;
  public readonly reflective: number;

  constructor(
    center: Vec3,
    radius: number,
    color: RGB,
    specular: number,
    reflective: number,
  ) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.specular = specular;
    this.reflective = reflective;
  }

  intersect(O: Vec3, D: Vec3): HitRecord | null {
    const r: number = this.radius;
    const CO: Vec3 = MathUtils.subtractVectors(O, this.center);

    const a: number = MathUtils.dotVectorsV3(D, D);
    const b: number = 2 * MathUtils.dotVectorsV3(CO, D);
    const c: number = MathUtils.dotVectorsV3(CO, CO) - r * r;

    const discriminantSquared: number = b ** 2 - 4 * a * c;

    if (discriminantSquared < 0) return null; // NO INTERSECTION

    const discriminant: number = Math.sqrt(b ** 2 - 4 * a * c);
    const intersections: Array<number> = [
      (-b + discriminant) / (2 * a),
      (-b - discriminant) / (2 * a),
    ];

    const validIntersections: number[] = intersections.filter((t) => t > 0);

    if (!validIntersections.length) return null;

    const distance: number = Math.min(...validIntersections);
    const position: Vec3 = MathUtils.addVectors(
      O,
      MathUtils.scaleVectorV3(D, distance),
    ); // P = O + t(V - O);
    const normal: Vec3 = this.computeNormal(position);

    return { distance, position, normal };
  }

  computeNormal(position: Vec3): Vec3 {
    const CP: Vec3 = MathUtils.subtractVectors(position, this.center);
    const magnitude = MathUtils.magnitudeV3(CP);
    const normal = MathUtils.scaleVectorV3(CP, 1 / magnitude);
    return normal;
  }

  serialize(): SerializedSphere {
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
