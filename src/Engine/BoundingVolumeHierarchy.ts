import { Triangle, BVHNode, Vec3 } from "../Utility/types";

// generate the BVH tree
export function generateBVH(triangles: Triangle[]): BVHNode | null {
  // (1) edge case - starting up the app with no polygons
  if (triangles.length === 0) return null;

  // (2) determine the longest axis
  const { minX, maxX, minY, maxY, minZ, maxZ, splitAxis } =
    determineLongestAxis(triangles);

  // (3) leaf node case - no children, has triangles attached
  if (triangles.length < 3) {
    return {
      left: null,
      right: null,
      splitAxis,
      minVals: [minX, minY, minZ],
      maxVals: [maxX, maxY, maxZ],
      triangles,
    };
  }

  // (4) partition the triangles along the longest axis
  const [leftTriangles, rightTriangles] = partitionTriangles(
    triangles,
    splitAxis,
  );

  // (5) generate children nodes
  const leftNode: BVHNode | null = generateBVH(leftTriangles);
  const rightNode: BVHNode | null = generateBVH(rightTriangles);

  // (6) pass the node up the call stack
  return {
    left: leftNode,
    right: rightNode,
    splitAxis,
    minVals: [minX, minY, minZ],
    maxVals: [maxX, maxY, maxZ],
    triangles: null,
  };
}

function determineLongestAxis(triangles: Triangle[]): Record<string, number> {
  let minX: number = Number.POSITIVE_INFINITY;
  let maxX: number = Number.NEGATIVE_INFINITY;
  let minY: number = Number.POSITIVE_INFINITY;
  let maxY: number = Number.NEGATIVE_INFINITY;
  let minZ: number = Number.POSITIVE_INFINITY;
  let maxZ: number = Number.NEGATIVE_INFINITY;

  for (let t of triangles) {
    minX = Math.min(t.V1[0], t.V2[0], t.V3[0], minX);
    maxX = Math.max(t.V1[0], t.V2[0], t.V3[0], maxX);
    minY = Math.min(t.V1[1], t.V2[1], t.V3[1], minY);
    maxY = Math.max(t.V1[1], t.V2[1], t.V3[1], maxY);
    minZ = Math.min(t.V1[2], t.V2[2], t.V3[2], minZ);
    maxZ = Math.max(t.V1[2], t.V2[2], t.V3[2], maxZ);
  }

  const xAxisLen: number = maxX - minX;
  const yAxisLen: number = maxY - minY;
  const zAxisLen: number = maxZ - minZ;

  const maxAxisLen = Math.max(xAxisLen, yAxisLen, zAxisLen);
  const splitAxis: 0 | 1 | 2 =
    xAxisLen === maxAxisLen ? 0 : yAxisLen === maxAxisLen ? 1 : 2;

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

function partitionTriangles(
  triangles: Triangle[],
  axis: number,
): [Triangle[], Triangle[]] {
  const sortedTriangles: Triangle[] = triangles.sort((a, b) => {
    const aMinOnAxis = Math.min(a.V1[axis], a.V2[axis], a.V3[axis]);
    const bMinOnAxis = Math.min(b.V1[axis], b.V2[axis], b.V3[axis]);
    return aMinOnAxis - bMinOnAxis;
  });

  const length = sortedTriangles.length;
  const half = Math.floor(length / 2);

  const leftHalf = sortedTriangles.slice(0, half);
  const rightHalf = sortedTriangles.slice(half, length);

  return [leftHalf, rightHalf];
}

export function generateBVHNodeTBounds(
  box: BVHNode,
  O: Vec3,
  invD: Vec3,
): [number, number] {
  // compute min scalar t's for ray-box intersections
  const tx1: number = (box.minVals[0] - O[0]) * invD[0];
  const ty1: number = (box.minVals[1] - O[1]) * invD[1];
  const tz1: number = (box.minVals[2] - O[2]) * invD[2];

  // compute max scalar t's for ray-box intersections
  const tx2: number = (box.maxVals[0] - O[0]) * invD[0];
  const ty2: number = (box.maxVals[1] - O[1]) * invD[1];
  const tz2: number = (box.maxVals[2] - O[2]) * invD[2];

  const xEntry: number = Math.min(tx1, tx2);
  const xExit: number = Math.max(tx1, tx2);

  const yEntry: number = Math.min(ty1, ty2);
  const yExit: number = Math.max(ty1, ty2);

  const zEntry: number = Math.min(tz1, tz2);
  const zExit: number = Math.max(tz1, tz2);

  const boxEntry: number = Math.max(xEntry, yEntry, zEntry);
  const boxExit: number = Math.min(xExit, yExit, zExit);

  return [boxEntry, boxExit];
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

  // if the box is beyond our closest triangle intersection, cull it
  if (boxEntryT > closestT) return false;

  // the intersection is valid
  return true;
}
