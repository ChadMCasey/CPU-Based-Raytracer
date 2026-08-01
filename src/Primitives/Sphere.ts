import {
  SceneObject,
  HitRecord,
  Vec3,
  RGB,
  SerializedSphere,
} from "../Utility/types";
import {
  dotVectorsV3,
  subtractVectors,
  addVectors,
  scaleVectorV3,
  magnitudeV3,
} from "../Utility/MathUtils";

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
    const CO: Vec3 = subtractVectors(O, this.center);

    const a: number = dotVectorsV3(D, D);
    const b: number = 2 * dotVectorsV3(CO, D);
    const c: number = dotVectorsV3(CO, CO) - r * r;

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
    const position: Vec3 = addVectors(O, scaleVectorV3(D, distance)); // P = O + t(V - O);
    const normal: Vec3 = this.computeNormal(position);

    return { distance, position, normal };
  }

  computeNormal(position: Vec3): Vec3 {
    const CP: Vec3 = subtractVectors(position, this.center);
    const magnitude = magnitudeV3(CP);
    const normal = scaleVectorV3(CP, 1 / magnitude);
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
