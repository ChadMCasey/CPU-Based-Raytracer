import { SceneObject, HitRecord, Vec3, RGB } from "./types";
import MathUtils from "./MathUtils";

const mathUtils = new MathUtils();

export class Sphere implements SceneObject {
  private center: Vec3;
  private radius: number;
  private RGB: RGB;

  constructor(center: Vec3, radius: number, RGB: RGB) {
    this.center = center;
    this.radius = radius;
    this.RGB = RGB;
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

    const validIntersections = intersections.filter(t =>  t > 0);

    if (!validIntersections.length) return null;

    return { distance: Math.min(...validIntersections) };
  }
}