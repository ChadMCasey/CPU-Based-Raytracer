import { SceneObject, HitRecord, Vec3, RGB } from "./types.js";
import MathUtils from "./MathUtils.js";

const mathUtils = new MathUtils();

export default class Sphere implements SceneObject {
  private center: Vec3;
  private radius: number;
  public readonly color: RGB;
  public readonly specular: number;

  constructor(center: Vec3, radius: number, color: RGB, specular: number) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.specular = specular;
  }

  intersect(O: Vec3, D: Vec3): HitRecord | null {
    const r: number = this.radius;
    const CO: Vec3 = mathUtils.subtractVectors(O, this.center);

    const a: number = mathUtils.dotVectors(D, D);
    const b: number = 2 * mathUtils.dotVectors(CO, D);
    const c: number = mathUtils.dotVectors(CO, CO) - r*r;

    const discriminantSquared: number = b**2 - 4*a*c;

    if (discriminantSquared < 0) 
      return null; // NO INTERSECTION
    
    const discriminant: number = Math.sqrt(b**2 - 4*a*c);
    const intersections: Array<number> = [(-b + discriminant) / (2*a),(-b - discriminant) / (2*a)];

    const validIntersections: number[] = intersections.filter(t =>  t > 0);

    if (!validIntersections.length) return null;

    const distance: number = Math.min(...validIntersections);
    const position: Vec3 = mathUtils.addVectors(O, mathUtils.scaleVector(D, distance)); // P = O + t(V - O);
    const normal: Vec3 = this.computeNormal(position);

    return { distance, position, normal };
  }

  computeNormal(position: Vec3): Vec3 {
    const CP: Vec3 = mathUtils.subtractVectors(position, this.center);
    const magnitude = mathUtils.magnitude(CP);
    const normal = mathUtils.scaleVector(CP, 1/magnitude);
    return normal;
  }
}