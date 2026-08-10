import { Primitive, BVHNode, Vec3, SceneIntersection } from "../Utility/types";
import { addVectors, scaleVectorV3 } from "../Utility/mathUtils";
import { DEBUG_MAIN_COLOR, DEBUG_SPECULAR, DEBUG_REFLECTIVE } from "../Utility/constants";

// generate the BVH tree
export function generateBVH(primitives: Primitive[]): BVHNode | null {
  // (1) edge case - starting up the app with no polygons
  if (primitives.length === 0) return null;

  // (2) determine the longest axis
  const { minX, maxX, minY, maxY, minZ, maxZ, splitAxis } = determineLongestAxis(primitives);

  // (3) leaf node case - no children, has primitives attached
  if (primitives.length < 3) {
    return {
      type: "BVHNode",
      left: null,
      right: null,
      splitAxis,
      bounds: { minX, maxX, minZ, maxZ, minY, maxY },
      color: DEBUG_MAIN_COLOR,
      specular: DEBUG_SPECULAR,
      reflective: DEBUG_REFLECTIVE,
      primitives,
    };
  }

  // (4) partition the primitives along the longest axis
  const [leftPrimitives, rightPrimitves] = partitionPrimitives(primitives, splitAxis);

  // (5) generate children nodes
  const leftNode: BVHNode | null = generateBVH(leftPrimitives);
  const rightNode: BVHNode | null = generateBVH(rightPrimitves);

  // (6) pass the node up the call stack
  return {
    type: "BVHNode",
    left: leftNode,
    right: rightNode,
    splitAxis,
    bounds: { minX, maxX, minZ, maxZ, minY, maxY },
    color: DEBUG_MAIN_COLOR,
    specular: DEBUG_SPECULAR,
    reflective: DEBUG_REFLECTIVE,
    primitives: null,
  };
}

function determineLongestAxis(primitives: Primitive[]): Record<string, number> {
  let minX: number = Number.POSITIVE_INFINITY;
  let minY: number = Number.POSITIVE_INFINITY;
  let minZ: number = Number.POSITIVE_INFINITY;

  let maxX: number = Number.NEGATIVE_INFINITY;
  let maxY: number = Number.NEGATIVE_INFINITY;
  let maxZ: number = Number.NEGATIVE_INFINITY;

  for (let p of primitives) {
    minX = Math.min(p.bounds.minX, minX);
    maxX = Math.max(p.bounds.maxX, maxX);
    minY = Math.min(p.bounds.minY, minY);
    maxY = Math.max(p.bounds.maxY, maxY);
    minZ = Math.min(p.bounds.minZ, minZ);
    maxZ = Math.max(p.bounds.maxZ, maxZ);
  }

  const xAxisLen: number = maxX - minX;
  const yAxisLen: number = maxY - minY;
  const zAxisLen: number = maxZ - minZ;

  const maxAxisLen = Math.max(xAxisLen, yAxisLen, zAxisLen);
  const splitAxis: 0 | 1 | 2 = xAxisLen === maxAxisLen ? 0 : yAxisLen === maxAxisLen ? 1 : 2;

  return {
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    splitAxis,
  };
}

function partitionPrimitives(primitives: Primitive[], axis: number): [Primitive[], Primitive[]] {
  const sortedPrimitives: Primitive[] = primitives.sort((a, b) => {
    const aMinOnAxis = axis === 0 ? a.bounds.minX : axis === 1 ? a.bounds.minY : a.bounds.minZ;
    const bMinOnAxis = axis === 0 ? b.bounds.minX : axis === 1 ? b.bounds.minY : b.bounds.minZ;
    return aMinOnAxis - bMinOnAxis;
  });

  const length = sortedPrimitives.length;
  const half = Math.floor(length / 2);

  const leftHalf = sortedPrimitives.slice(0, half);
  const rightHalf = sortedPrimitives.slice(half, length);

  return [leftHalf, rightHalf];
}

export function generateBVHNodeTBounds(box: BVHNode, O: Vec3, invD: Vec3): [number, number] {
  // compute min scalar t's for ray-box intersections
  const tx1: number = (box.bounds.minX - O[0]) * invD[0];
  const ty1: number = (box.bounds.minY - O[1]) * invD[1];
  const tz1: number = (box.bounds.minZ - O[2]) * invD[2];

  // compute max scalar t's for ray-box intersections
  const tx2: number = (box.bounds.maxX - O[0]) * invD[0];
  const ty2: number = (box.bounds.maxY - O[1]) * invD[1];
  const tz2: number = (box.bounds.maxZ - O[2]) * invD[2];

  const xEntry: number = Math.min(tx1, tx2);
  const xExit: number = Math.max(tx1, tx2);

  const yEntry: number = Math.min(ty1, ty2);
  const yExit: number = Math.max(ty1, ty2);

  const zEntry: number = Math.min(tz1, tz2);
  const zExit: number = Math.max(tz1, tz2);

  const boxEntryT: number = Math.max(xEntry, yEntry, zEntry);
  const boxExitT: number = Math.min(xExit, yExit, zExit);

  // the min max Ts where the ray actually enters the box
  return [boxEntryT, boxExitT];
}

export function determineValidBVHInteresection(
  closestT: number,
  boxEntryT: number,
  boxExitT: number,
  viewportDistance: number,
) {
  // the ray is never fully contained within the box, cull it
  if (boxExitT < boxEntryT) return false;

  // the ray exits the box in front of the viewport plane, cull it
  if (boxExitT < viewportDistance) return false;

  // if the box is beyond our closest primitive intersection, cull it
  if (boxEntryT > closestT) return false;

  // the intersection is valid
  return true;
}

// determine if the intersection with the bounding box is right along an edge of the box
export function determineBoxEdgeIntersection(
  box: BVHNode,
  boxEntryT: number,
  boxExitT: number,
  O: Vec3,
  D: Vec3,
): SceneIntersection | null {
  let boxMinX: number = box.bounds.minX;
  let boxMinY: number = box.bounds.minY;
  let boxMinZ: number = box.bounds.minZ;
  let boxMaxX: number = box.bounds.maxX;
  let boxMaxY: number = box.bounds.maxY;
  let boxMaxZ: number = box.bounds.maxZ;

  const PEntry: Vec3 = addVectors(O, scaleVectorV3(D, boxEntryT));
  const entryBounds = 0.005 * boxEntryT;
  let PEntryX: number = PEntry[0];
  let PEntryY: number = PEntry[1];
  let PEntryZ: number = PEntry[2];

  // a collision on an edge occurs when two + boundaries are hit at once
  const xEntryHit = Math.abs(PEntryX - boxMinX) < entryBounds || Math.abs(PEntryX - boxMaxX) < entryBounds ? 1 : 0;
  const yEntryHit = Math.abs(PEntryY - boxMinY) < entryBounds || Math.abs(PEntryY - boxMaxY) < entryBounds ? 1 : 0;
  const zEntryHit = Math.abs(PEntryZ - boxMinZ) < entryBounds || Math.abs(PEntryZ - boxMaxZ) < entryBounds ? 1 : 0;
  const entryColisionCount = xEntryHit + yEntryHit + zEntryHit;

  // hits edge of AABB on entry
  if (entryColisionCount >= 2)
    return {
      distance: boxEntryT,
      position: PEntry,
      normal: [0, 0, 0],
      object: box,
      debug: true,
    };

  const PExit: Vec3 = addVectors(O, scaleVectorV3(D, boxExitT));
  const exitBounds = 0.005 * boxExitT;
  let PExitX: number = PExit[0];
  let PExitY: number = PExit[1];
  let PExitZ: number = PExit[2];

  const xExitHit = Math.abs(PExitX - boxMinX) < exitBounds || Math.abs(PExitX - boxMaxX) < exitBounds ? 1 : 0;
  const yExitHit = Math.abs(PExitY - boxMinY) < exitBounds || Math.abs(PExitY - boxMaxY) < exitBounds ? 1 : 0;
  const zExitHit = Math.abs(PExitZ - boxMinZ) < exitBounds || Math.abs(PExitZ - boxMaxZ) < exitBounds ? 1 : 0;
  const exitColisionCount = xExitHit + yExitHit + zExitHit;

  // hits edge of AABB on exit
  if (exitColisionCount >= 2)
    return {
      distance: boxExitT,
      position: PExit,
      normal: [0, 0, 0],
      object: box,
      debug: true,
    };

  // no edge collision
  return null;
}
