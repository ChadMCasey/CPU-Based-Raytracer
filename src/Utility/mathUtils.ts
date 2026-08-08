import {
  Vec3,
  Vec2,
  ScenePayload,
  SceneIntersection,
  Primitive,
  HitRecord,
  BVHNode,
} from "./types";
import { computeSphereIntersection } from "./sphereUtils";
import { computeTriangleIntersection } from "./triangleUtils";
import {
  generateBVHNodeTBounds,
  determineValidBVHInteresection,
} from "../Engine/BoundingVolumeHierarchy";

// calculate the dot product of 2 vectors
export function dotVectorsV3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function dotVectorsV2(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1];
}

// subtract two vectors
export function subtractVectors(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

// add two vectors
export function addVectors(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

// scale vector by constant k
export function scaleVectorV3(a: Vec3, k: number): Vec3 {
  return [a[0] * k, a[1] * k, a[2] * k];
}

export function scaleVectorV2(a: Vec2, k: number): Vec2 {
  return [a[0] * k, a[1] * k];
}

export function magnitudeV2(a: Vec2): number {
  return Math.sqrt(dotVectorsV2(a, a));
}

export function magnitudeV3(a: Vec3): number {
  return Math.sqrt(dotVectorsV3(a, a));
}

export function convertDegToRad(degrees: number): number {
  return (Math.PI / 180) * degrees;
}

// cross a,b =  𝑎1*⁢𝑏2−𝑎2*⁢𝑏1, 𝑎2*⁢𝑏0−𝑎0*⁢𝑏2, 𝑎0*⁢𝑏1−𝑎1⁢*𝑏0
export function crossProduct(a: Vec3, b: Vec3): Vec3 {
  const v1: number = a[1] * b[2] - a[2] * b[1];
  const v2: number = a[2] * b[0] - a[0] * b[2];
  const v3: number = a[0] * b[1] - a[1] * b[0];
  return [v1, v2, v3];
}

// hard coding the shit out of this, we need to fix this later
export function multiplyRotationalMatrices(
  A: number[][],
  B: number[][],
): number[][] {
  // top row
  const TopLeft: number =
    A[0][0] * B[0][0] + A[0][1] * B[1][0] + A[0][2] * B[2][0];
  const TopCenter: number =
    A[0][0] * B[0][1] + A[0][1] * B[1][1] + A[0][2] * B[2][1];
  const TopRight: number =
    A[0][0] * B[0][2] + A[0][1] * B[1][2] + A[0][2] * B[2][2];

  // middle row
  const MiddleLeft: number =
    A[1][0] * B[0][0] + A[1][1] * B[1][0] + A[1][2] * B[2][0];
  const MiddleCenter: number =
    A[1][0] * B[0][1] + A[1][1] * B[1][1] + A[1][2] * B[2][1];
  const MiddleRight: number =
    A[1][0] * B[0][2] + A[1][1] * B[1][2] + A[1][2] * B[2][2];

  // bottom row
  const BottomLeft: number =
    A[2][0] * B[0][0] + A[2][1] * B[1][0] + A[2][2] * B[2][0];
  const BottomCenter: number =
    A[2][0] * B[0][1] + A[2][1] * B[1][1] + A[2][2] * B[2][1];
  const BottomRight: number =
    A[2][0] * B[0][2] + A[2][1] * B[1][2] + A[2][2] * B[2][2];

  const resultingMatrix: number[][] = [
    [TopLeft, TopCenter, TopRight],
    [MiddleLeft, MiddleCenter, MiddleRight],
    [BottomLeft, BottomCenter, BottomRight],
  ];

  return resultingMatrix;
}

export function multiplyDirectionByRotation(R: number[][], D: Vec3): Vec3 {
  const X: number = R[0][0] * D[0] + R[0][1] * D[1] + R[0][2] * D[2];
  const Y: number = R[1][0] * D[0] + R[1][1] * D[1] + R[1][2] * D[2];
  const Z: number = R[2][0] * D[0] + R[2][1] * D[1] + R[2][2] * D[2];
  return [X, Y, Z];
}

// compute pitch (x - axis) rotation matrix
export function computeRx(pitchInRad: number): number[][] {
  return [
    [1, 0, 0],
    [0, Math.cos(pitchInRad), Math.sin(pitchInRad)],
    [0, -Math.sin(pitchInRad), Math.cos(pitchInRad)],
  ];
}

export function computeRy(yawInRad: number): number[][] {
  return [
    [Math.cos(yawInRad), 0, Math.sin(yawInRad)],
    [0, 1, 0],
    [-Math.sin(yawInRad), 0, Math.cos(yawInRad)],
  ];
}

export function computeRz(rollInRad: number): number[][] {
  return [
    [Math.cos(rollInRad), Math.sin(rollInRad), 0],
    [-Math.sin(rollInRad), Math.cos(rollInRad), 0],
    [0, 0, 1],
  ];
}

// reflect R about normal N
export function reflectVector(R: Vec3, N: Vec3): Vec3 {
  const TwoN: Vec3 = scaleVectorV3(N, 2);
  const RDotN: number = dotVectorsV3(R, N);
  const Scale2N: Vec3 = scaleVectorV3(TwoN, RDotN);
  const subR: Vec3 = subtractVectors(Scale2N, R);
  return subR; // reflected vector
}

export function computeDirectionalVector(
  viewportScaleX: number,
  viewportScaleY: number,
  cartX: number,
  cartY: number,
): Vec3 {
  const Vx = viewportScaleX * cartX;
  const Vy = viewportScaleY * cartY;
  const Vz = 1;
  return [Vx, Vy, Vz];
}

export function mapToCartesianX(halfTargetW: number, x: number): number {
  return x - halfTargetW;
}

export function mapToCartesianY(halfTargetH: number, y: number): number {
  return halfTargetH - y;
}

export function closestIntersection(
  O: Vec3,
  D: Vec3,
  DdotD: number,
  minT: number,
  maxT: number,
  scenePayload: ScenePayload,
  viewportDistance: number,
): SceneIntersection | null {
  let closestT: number = Number.POSITIVE_INFINITY;
  let closestIntersection: SceneIntersection | null = null;
  let bvhRoot = scenePayload.sceneData.bvh;

  if (!bvhRoot) return null;

  // compute inverse D values (avoid re-computing per BVH node)
  const invD: Vec3 = [1 / D[0], 1 / D[1], 1 / D[2]];

  const stack: BVHNode[] = [bvhRoot];
  while (stack.length) {
    const box = stack.pop();

    // pop can return undefined
    if (!box) continue;

    // produce the bounds on our box
    const [boxEntryT, boxExitT] = generateBVHNodeTBounds(box, O, invD);

    // determine if valid box intersection
    const validIntersection: boolean = determineValidBVHInteresection(
      closestT,
      boxEntryT,
      boxExitT,
      viewportDistance,
    );

    if (!validIntersection) continue;

    // non leaf case, examine the children nodes
    if (!box.triangles) {
      const left = box.left;
      const right = box.right;
      if (left && !right) stack.push(left); // left only
      if (!left && right) stack.push(right); // right only
      if (left && right)
        D[box.splitAxis] > 0
          ? stack.push(right, left)
          : stack.push(left, right);
    } else {
      // leaf case, compute ray triangle intersections
      for (let primitive of box.triangles) {
        const intersection: HitRecord | null = computeIntersection(
          O,
          D,
          DdotD,
          primitive,
        );
        if (!intersection) continue;
        if (
          intersection.distance >= minT &&
          intersection.distance <= maxT &&
          intersection.distance < closestT
        ) {
          closestT = intersection.distance;
          closestIntersection = {
            distance: intersection.distance,
            position: intersection.position,
            normal: intersection.normal,
            object: primitive,
          };
        }
      }
    }
  }

  // weird second loop for spheres - TODO: makes spheres out of triangles
  for (let primitive of scenePayload.sceneData.primatives) {
    if (primitive.type !== "sphere") continue;
    const intersection: HitRecord | null = computeIntersection(
      O,
      D,
      DdotD,
      primitive,
    );
    if (!intersection) continue;
    if (
      intersection.distance >= minT &&
      intersection.distance <= maxT &&
      intersection.distance < closestT
    ) {
      closestT = intersection.distance;
      closestIntersection = {
        distance: intersection.distance,
        position: intersection.position,
        normal: intersection.normal,
        object: primitive,
      };
    }
  }

  return closestIntersection;
}

export function computeIntersection(
  O: Vec3,
  D: Vec3,
  DdotD: number,
  object: Primitive,
): HitRecord | null {
  switch (object.type) {
    case "sphere":
      return computeSphereIntersection(O, D, DdotD, object);
    case "triangle":
      return computeTriangleIntersection(O, D, object);
    default:
      return null;
  }
}
