import { Triangle, BVHNode } from "../Utility/types";

// generate the BVH tree
export function generateBVH(triangles: Triangle[]): BVHNode | null {
  // (1) edge case - starting up the app with no polygons in the scene at all
  if (triangles.length === 0) return null;

  // (2) determine the longest axis
  const { minX, maxX, minY, maxY, minZ, maxZ, axis } =
    determineLongestAxis(triangles);

  // (3) leaf node case - no children, has triangles attached
  if (triangles.length < 3) {
    return {
      left: null,
      right: null,
      minVals: [minX, minY, minZ],
      maxVals: [maxX, maxY, maxZ],
      triangles,
    };
  }

  // (4) partition the triangles along the longest axis
  const [leftTriangles, rightTriangles] = partitionTriangles(triangles, axis);

  // (5) generate children nodes
  const leftNode: BVHNode | null = generateBVH(leftTriangles);
  const rightNode: BVHNode | null = generateBVH(rightTriangles);

  // (6) pass the node up the call stack
  return {
    left: leftNode,
    right: rightNode,
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
  const axis = xAxisLen === maxAxisLen ? 0 : yAxisLen === maxAxisLen ? 1 : 2;

  return {
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    axis,
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
