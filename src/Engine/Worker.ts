import {
  RGB,
  ScenePayload,
  Task,
  Vec3,
  SceneIntersection,
  HitRecord,
  Primative,
  Sphere,
  Light,
  DirectionLight,
  PointLight,
} from "../Utility/types";
import {
  MAX_REFLECT_RECUR,
  CANVAS_DEFAULT_BACKGROUND,
  MIN_T,
} from "../Utility/constants";
import {
  dotVectorsV3,
  subtractVectors,
  addVectors,
  scaleVectorV3,
  multiplyDirectionByRotation,
  reflectVector,
  magnitudeV3,
} from "../Utility/MathUtils";

self.addEventListener("message", (event: MessageEvent) => {
  const scenePayload: ScenePayload = event.data.scenePayload;
  const sharedArrayBuffer: Uint8ClampedArray = event.data.sharedArrayBuffer;
  const {
    startX,
    startY,
    width,
    height,
    targetWidth,
    targetHeight,
    viewportWidth,
    viewportHeight,
  }: Task = event.data.openTask;

  // iterate section of render target upon which our calculations will be done
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      // transform (x,y) into coordinates defined by a 2d cartesian plane
      const [cartX, cartY] = mapToCartesianPoints(
        targetWidth,
        targetHeight,
        x,
        y,
      );

      // compute D from the origin to the point on the viewport
      const rawD: Vec3 = computeDirectionalVector(
        targetWidth,
        targetHeight,
        viewportWidth,
        viewportHeight,
        cartX,
        cartY,
      );

      // rotate D to account for camera rotation
      const rotatedD: Vec3 = multiplyDirectionByRotation(
        scenePayload.cameraRotation,
        rawD,
      );

      // trace ray (this will originate D from the cameras position)
      const computedColor: RGB = traceRay(
        scenePayload.cameraPOS,
        rotatedD,
        1,
        Number.POSITIVE_INFINITY,
        MAX_REFLECT_RECUR,
        scenePayload,
      );

      // write color data to buffer
      writeColorDataToBuffer(
        sharedArrayBuffer,
        computedColor,
        targetWidth,
        x,
        y,
      );
    }
  }

  // dispatch response to let app know that task is completed
  self.postMessage({});
});

function writeColorDataToBuffer(
  sharedArrayBuffer: Uint8ClampedArray,
  color: RGB,
  width: number,
  column: number,
  row: number,
) {
  // compute pixel index within shared array buffer
  const index: number = (width * row + column) * 4;

  // write color data into buffer
  sharedArrayBuffer[index] = color[0]; // R
  sharedArrayBuffer[index + 1] = color[1]; // G
  sharedArrayBuffer[index + 2] = color[2]; // B
  sharedArrayBuffer[index + 3] = 255; // A
}

// mapp x to 2D cartesian X
function mapToCartesianPoints(
  targetW: number,
  targetH: number,
  x: number,
  y: number,
): [number, number] {
  let cartX: number, cartY: number;
  cartX = x - targetW / 2;
  cartY = targetH / 2 - y;

  return [cartX, cartY];
}

// compute directional D raw (scale and place 1 unit away at VP)
function computeDirectionalVector(
  Tw: number,
  Th: number,
  Vw: number,
  Vh: number,
  cartX: number,
  cartY: number,
): Vec3 {
  const Vx = (Vw / Tw) * cartX;
  const Vy = (Vh / Th) * cartY;
  const Vz = 1;
  return [Vx, Vy, Vz];
}

// trace the ray and return a color for the pixel
function traceRay(
  cameraPOS: Vec3,
  rotatedD: Vec3,
  minT: number,
  maxT: number,
  recurLeft: number,
  scenePayload: ScenePayload,
): RGB {
  // we first need to find the closest intersection between the ray and the scene objects
  const intersection: SceneIntersection | null = closestIntersection(
    cameraPOS,
    rotatedD,
    minT,
    maxT,
    scenePayload,
  );

  // return default background color if no intersection
  if (!intersection) return CANVAS_DEFAULT_BACKGROUND;

  // apply lighting to the closest intersection to the camera
  const lightIntensity: number = computeLighting(
    intersection.position,
    intersection.normal,
    scaleVectorV3(rotatedD, -1),
    intersection.object.specular,
    scenePayload,
  );

  // compute the local color, scale color by intensity of light
  const localColor: RGB = scaleVectorV3(
    intersection.object.color,
    lightIntensity,
  );

  // if an object is not reflective or we hit our recur limit, return local color
  const reflective: number = intersection.object.reflective;
  if (recurLeft <= 0 || reflective <= 0) return localColor;

  // otherwise compute the reflected color
  const R: Vec3 = reflectVector(
    scaleVectorV3(rotatedD, -1),
    intersection.normal,
  );
  const reflectedColor: RGB = traceRay(
    intersection.position,
    R,
    MIN_T,
    Number.POSITIVE_INFINITY,
    recurLeft - 1,
    scenePayload,
  );

  // aggregate color data for reflection + local color
  const localContribution: RGB = scaleVectorV3(localColor, 1 - reflective);
  const reflectedContribution: RGB = scaleVectorV3(reflectedColor, reflective);

  // sum the two values to produce the output value
  return addVectors(localContribution, reflectedContribution);
}

function closestIntersection(
  O: Vec3,
  D: Vec3,
  minT: number,
  maxT: number,
  scenePayload: ScenePayload,
): SceneIntersection | null {
  let closestT: number = Number.POSITIVE_INFINITY;
  let closestIntersection: SceneIntersection | null = null;

  for (let object of scenePayload.sceneData.primatives) {
    const intersection: HitRecord | null = computeIntersection(O, D, object);

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
        object: object,
      };
    }
  }

  return closestIntersection;
}

function computeIntersection(
  O: Vec3,
  D: Vec3,
  object: Primative,
): HitRecord | null {
  switch (object.type) {
    case "sphere":
      return computeSphereIntersection(O, D, object);
  }
}

function computeSphereIntersection(O: Vec3, D: Vec3, sphere: Sphere) {
  const r: number = sphere.radius;
  const CO: Vec3 = subtractVectors(O, sphere.center);

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
  const normal: Vec3 = computeNormal(position, sphere);

  return { distance, position, normal };
}

function computeNormal(position: Vec3, sphere: Sphere): Vec3 {
  const CP: Vec3 = subtractVectors(position, sphere.center);
  const magnitude = magnitudeV3(CP);
  const normal = scaleVectorV3(CP, 1 / magnitude);
  return normal;
}

function computeLighting(
  P: Vec3,
  N: Vec3,
  V: Vec3,
  specular: number,
  scenePayload: ScenePayload,
): number {
  let intensity: number = 0.0;

  for (let light of scenePayload.sceneData.lights) {
    switch (light.type) {
      case "ambient":
        intensity += computeAmbientLighting(light);
        break;
      case "directional":
        intensity += computeDirectionalLighting(
          P,
          N,
          V,
          specular,
          light,
          scenePayload,
        );
        break;
      case "point":
        intensity += computePointLighting(
          P,
          N,
          V,
          specular,
          light,
          scenePayload,
        );
        break;
    }
  }

  return intensity;
}

function computeAmbientLighting(light: Light) {
  return light.intensity;
}

function computeDirectionalLighting(
  P: Vec3,
  N: Vec3,
  V: Vec3,
  specular: number,
  light: DirectionLight,
  scenePayload: ScenePayload,
) {
  // shadow properties
  const lightDirectionFromP: Vec3 = light.direction;
  const maxT: number = light.maxT;

  // compute closest intersection between P and light
  const lightObstruction: SceneIntersection | null = closestIntersection(
    P,
    lightDirectionFromP,
    MIN_T,
    maxT,
    scenePayload,
  );

  // no obstruction so add in lighting
  if (!lightObstruction) {
    const DotNL = dotVectorsV3(N, lightDirectionFromP);

    if (DotNL < 0) return 0;

    const diffuseScalar: number = computeDirectionalScalarDiffuse(
      N,
      lightDirectionFromP,
      DotNL,
    );
    const specularScalar: number = computeDirectionalScalarHighlight(
      N,
      V,
      specular,
      lightDirectionFromP,
    );

    const totalScalar: number =
      (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
    const totalContributedIllumination: number = totalScalar * light.intensity;

    return totalContributedIllumination;
  }

  // for now obstruction means no contributed light
  return 0;
}

function computeDirectionalScalarDiffuse(
  N: Vec3,
  L: Vec3,
  DotNL: number,
): number {
  return DotNL / (magnitudeV3(L) * magnitudeV3(N));
}

function computeDirectionalScalarHighlight(
  N: Vec3,
  V: Vec3,
  s: number,
  L: Vec3,
): number {
  if (s === -1) return -1;

  const R: Vec3 = reflectVector(L, N);
  const RDotV: number = dotVectorsV3(R, V);

  if (RDotV < 0) return -1;

  const magR: number = magnitudeV3(R);
  const magV: number = magnitudeV3(V);
  const cosA: number = RDotV / (magR * magV);
  const specularScalar: number = cosA ** s;

  return specularScalar;
}

function computePointLighting(
  P: Vec3,
  N: Vec3,
  V: Vec3,
  s: number,
  light: PointLight,
  scenePayload: ScenePayload,
): number {
  // shadow properties
  const lightDirectionFromP: Vec3 = subtractVectors(light.position, P);
  const maxT: number = 1;

  // compute closest intersection between P and light
  const lightObstruction: SceneIntersection | null = closestIntersection(
    P,
    lightDirectionFromP,
    MIN_T,
    maxT,
    scenePayload,
  );

  // no obstruction so add in lighting
  if (!lightObstruction) {
    const L: Vec3 = subtractVectors(light.position, P);
    const DotNL: number = dotVectorsV3(N, L);

    if (DotNL < 0) return 0;

    const diffuseScalar: number = computePointScalarDiffuse(N, L, DotNL);
    const specularScalar: number = computePointScalarHighlight(N, V, s, L);

    const totalScalar: number =
      (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
    const totalContributedIllumination: number = totalScalar * light.intensity;

    return totalContributedIllumination;
  }

  // for now obstruction means no contributed light
  return 0;
}

function computePointScalarDiffuse(N: Vec3, L: Vec3, DotNL: number): number {
  return DotNL / (magnitudeV3(L) * magnitudeV3(N));
}

function computePointScalarHighlight(
  N: Vec3,
  V: Vec3,
  s: number,
  L: Vec3,
): number {
  if (s === -1) return -1;

  const R: Vec3 = reflectVector(L, N);
  const RDotV: number = dotVectorsV3(R, V);

  if (RDotV < 0) return -1;

  const magR: number = magnitudeV3(R);
  const magV: number = magnitudeV3(V);
  const cosA: number = RDotV / (magR * magV);
  const specularScalar: number = cosA ** s;

  return specularScalar;
}
