import { Vec3, Sphere, RGB, Bounds } from "./types";
import {
  dotVectorsV3,
  magnitudeV3,
  subtractVectors,
  addVectors,
  scaleVectorV3,
} from "./mathUtils";

export function createSphere(
  radius: number,
  center: Vec3,
  color: RGB,
  specular: number,
  reflective: number,
): Sphere {
  return {
    type: "sphere",
    r: radius,
    rSquared: radius * radius,
    center,
    bounds: computeSphereBounds(center, radius),
    color,
    specular,
    reflective,
  };
}

export function computeSphereIntersection(
  O: Vec3,
  D: Vec3,
  DdotD: number,
  sphere: Sphere,
) {
  const r: number = sphere.r;
  const CO: Vec3 = subtractVectors(O, sphere.center);

  const a: number = DdotD;
  const b: number = 2 * dotVectorsV3(CO, D);
  const c: number = dotVectorsV3(CO, CO) - sphere.rSquared;

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
  const normal: Vec3 = computeNormal(position, sphere);

  return { distance, position, normal };
}

export function computeNormal(position: Vec3, sphere: Sphere): Vec3 {
  const CP: Vec3 = subtractVectors(position, sphere.center);
  const magnitude = magnitudeV3(CP);
  const normal = scaleVectorV3(CP, 1 / magnitude);
  return normal;
}

export function computeSphereBounds(center: Vec3, r: number): Bounds {
  return {
    minX: center[0] - r,
    maxX: center[0] + r,
    minY: center[1] - r,
    maxY: center[1] + r,
    minZ: center[2] - r,
    maxZ: center[2] + r,
  };
}
