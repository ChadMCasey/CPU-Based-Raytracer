import { Vec3, Sphere } from "./types";
import { dotVectorsV3, magnitudeV3, subtractVectors, addVectors, scaleVectorV3 } from "./mathUtils";

export function computeSphereIntersection(O: Vec3, D: Vec3, sphere: Sphere) {
  const r: number = sphere.radius;
  const CO: Vec3 = subtractVectors(O, sphere.center);

  const a: number = dotVectorsV3(D, D);
  const b: number = 2 * dotVectorsV3(CO, D);
  const c: number = dotVectorsV3(CO, CO) - r * r;

  const discriminantSquared: number = b ** 2 - 4 * a * c;

  if (discriminantSquared < 0) return null; // NO INTERSECTION

  const discriminant: number = Math.sqrt(b ** 2 - 4 * a * c);
  const intersections: Array<number> = [(-b + discriminant) / (2 * a), (-b - discriminant) / (2 * a)];

  const validIntersections: number[] = intersections.filter((t) => t > 0);

  if (!validIntersections.length) return null;

  const distance: number = Math.min(...validIntersections);
  const position: Vec3 = addVectors(O, scaleVectorV3(D, distance)); // P = O + t(V - O);
  const normal: Vec3 = computeNormal(position, sphere);

  return { distance, position, normal };
}

export function computeNormal(position: Vec3, sphere: Sphere): Vec3 {
  const CP: Vec3 = subtractVectors(position, sphere.center);
  const magnitude = magnitudeV3(CP);
  const normal = scaleVectorV3(CP, 1 / magnitude);
  return normal;
}
