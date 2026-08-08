import { Vec3, Triangle, HitRecord, RGB } from "./types";
import {
  subtractVectors,
  crossProduct,
  scaleVectorV3,
  magnitudeV3,
  dotVectorsV3,
  addVectors,
} from "./mathUtils";

// factory function for triangles
export function createTriangle(
  V1: Vec3,
  V2: Vec3,
  V3: Vec3,
  color: RGB,
  specular: number,
  reflective: number,
): Triangle {
  return {
    type: "triangle",
    V1,
    V2,
    V3,
    color,
    specular,
    reflective,
    normal: computeTriangleNormal(V1, V2, V3),
  };
}

// factory function for cube
export function createCube(
  center: Vec3,
  size: number,
  color: RGB,
  specular: number,
  reflective: number,
) {
  const Cx = center[0];
  const Cy = center[1];
  const Cz = center[2];

  const s: number = size / 2;

  // define 8 corners
  const minX = Cx - s;
  const maxX = Cx + s;
  const minY = Cy - s;
  const maxY = Cy + s;
  const minZ = Cz - s;
  const maxZ = Cz + s;

  const Triangles: Triangle[] = [
    // front face
    createTriangle(
      [minX, minY, minZ],
      [maxX, maxY, minZ],
      [maxX, minY, minZ],
      color,
      specular,
      reflective,
    ),
    createTriangle(
      [minX, maxY, minZ],
      [maxX, maxY, minZ],
      [minX, minY, minZ],
      color,
      specular,
      reflective,
    ),
    // back face
    createTriangle(
      [minX, minY, maxZ],
      [maxX, minY, maxZ],
      [maxX, maxY, maxZ],
      color,
      specular,
      reflective,
    ),
    createTriangle(
      [minX, maxY, maxZ],
      [minX, minY, maxZ],
      [maxX, maxY, maxZ],
      color,
      specular,
      reflective,
    ),
    // left face
    createTriangle(
      [minX, minY, minZ],
      [minX, minY, maxZ],
      [minX, maxY, minZ],
      color,
      specular,
      reflective,
    ),
    createTriangle(
      [minX, maxY, minZ],
      [minX, minY, maxZ],
      [minX, maxY, maxZ],
      color,
      specular,
      reflective,
    ),
    // right face
    createTriangle(
      [maxX, minY, minZ],
      [maxX, maxY, minZ],
      [maxX, minY, maxZ],
      color,
      specular,
      reflective,
    ),
    createTriangle(
      [maxX, maxY, minZ],
      [maxX, maxY, maxZ],
      [maxX, minY, maxZ],
      color,
      specular,
      reflective,
    ),
    // bottom face
    createTriangle(
      [minX, minY, minZ],
      [maxX, minY, minZ],
      [maxX, minY, maxZ],
      color,
      specular,
      reflective,
    ),
    createTriangle(
      [minX, minY, minZ],
      [minX, minY, maxZ],
      [maxX, minY, maxZ],
      color,
      specular,
      reflective,
    ),
    // top face
    createTriangle(
      [minX, maxY, minZ],
      [maxX, maxY, minZ],
      [maxX, maxY, maxZ],
      color,
      specular,
      reflective,
    ),
    createTriangle(
      [minX, maxY, minZ],
      [minX, maxY, maxZ],
      [maxX, maxY, maxZ],
      color,
      specular,
      reflective,
    ),
  ];

  return Triangles;
}

export function computeTriangleNormal(V1: Vec3, V2: Vec3, V3: Vec3) {
  // create two vectors from our vertices, these define a plane
  const V12: Vec3 = subtractVectors(V2, V1);
  const V13: Vec3 = subtractVectors(V3, V1);

  // cross product of two non-colinear vectors a,b produces a
  // third vector c that is orthogonal to both a and b.
  const perpToPlane: Vec3 = crossProduct(V12, V13);

  // scale to unit length for normal
  const normalToPlane: Vec3 = scaleVectorV3(
    perpToPlane,
    1 / magnitudeV3(perpToPlane),
  );

  return normalToPlane;
}

export function computeTriangleIntersection(
  O: Vec3,
  D: Vec3,
  triangle: Triangle,
): HitRecord | null {
  // if D dot N is 0 then our directional ray
  // is perpendicular to the normal N of our triangle.
  const dotProduct: number = dotVectorsV3(D, triangle.normal);

  // D is parallel to our triangle
  if (dotProduct === 0) return null;

  // D intersects our plane, solve for t where P = O + tD.
  const VdotN: number = dotVectorsV3(triangle.V1, triangle.normal);
  const OdotN: number = dotVectorsV3(O, triangle.normal);
  const DdotN: number = dotVectorsV3(D, triangle.normal);
  const t: number = (VdotN - OdotN) / DdotN;

  // now we can find P, the point in our plane
  const P: Vec3 = addVectors(O, scaleVectorV3(D, t));

  // create edge vectors and the corresponding Vp vector
  const E1: Vec3 = subtractVectors(triangle.V2, triangle.V1);
  const Vp1: Vec3 = subtractVectors(P, triangle.V1);
  const E2: Vec3 = subtractVectors(triangle.V3, triangle.V2);
  const Vp2: Vec3 = subtractVectors(P, triangle.V2);
  const E3: Vec3 = subtractVectors(triangle.V1, triangle.V3);
  const Vp3: Vec3 = subtractVectors(P, triangle.V3);

  const leftOfE1: boolean =
    dotVectorsV3(crossProduct(E1, Vp1), triangle.normal) >= 0;
  const leftOfE2: boolean =
    dotVectorsV3(crossProduct(E2, Vp2), triangle.normal) >= 0;
  const leftOfE3: boolean =
    dotVectorsV3(crossProduct(E3, Vp3), triangle.normal) >= 0;

  // the point P is in our plane, and within our triangle
  if (leftOfE1 && leftOfE2 && leftOfE3) {
    return {
      distance: t,
      position: P,
      normal: triangle.normal,
    };
  }

  // the case when D does intersect our triangle plane
  // but the intersection does not occur within the bounds of our triangle
  return null;
}
