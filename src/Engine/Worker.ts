import { computeLighting } from "../Utility/lightUtils";
import { RGB, ScenePayload, Task, Vec3, SceneIntersection } from "../Utility/types";
import { MAX_REFLECT_RECUR, CANVAS_DEFAULT_BACKGROUND, MIN_T } from "../Utility/constants";
import {
  addVectors,
  scaleVectorV3,
  multiplyDirectionByRotation,
  reflectVector,
  computeDirectionalVector,
  mapToCartesianX,
  mapToCartesianY,
  closestIntersection,
  dotVectorsV3,
} from "../Utility/mathUtils";

self.addEventListener("message", (event: MessageEvent) => {
  const scenePayload: ScenePayload = event.data.scenePayload;
  const sharedArrayBuffer: Uint8ClampedArray = event.data.sharedArrayBuffer;
  const {
    startX,
    startY,
    width,
    height,
    targetWidth,
    halfTargetWidth,
    halfTargetHeight,
    viewportScaleX,
    viewportScaleY,
    viewportDistance,
  }: Task = event.data.openTask;

  // iterate section of render target upon which our calculations will be done
  for (let y = startY; y < startY + height; y++) {
    // map to 2D cartesian plane from canvas coords
    const cartY = mapToCartesianY(halfTargetHeight, y);

    for (let x = startX; x < startX + width; x++) {
      // map to 2D cartesian plane from canvas coords
      const cartX = mapToCartesianX(halfTargetWidth, x);

      // compute D from the origin to the point on the viewport
      const rawD: Vec3 = computeDirectionalVector(viewportScaleX, viewportScaleY, cartX, cartY);

      // rotate D to account for camera rotation
      const rotatedD: Vec3 = multiplyDirectionByRotation(scenePayload.cameraRotation, rawD);

      // trace ray (this will originate D from the cameras position)
      const computedColor: RGB = traceRay(
        scenePayload.cameraPOS,
        rotatedD,
        1,
        Number.POSITIVE_INFINITY,
        MAX_REFLECT_RECUR,
        scenePayload,
        viewportDistance,
      );

      // write color data to buffer
      writeColorDataToBuffer(sharedArrayBuffer, computedColor, targetWidth, x, y);
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

// trace the ray and return a color for the pixel
function traceRay(
  cameraPOS: Vec3,
  rotatedD: Vec3,
  minT: number,
  maxT: number,
  recurLeft: number,
  scenePayload: ScenePayload,
  viewportDistance: number,
): RGB {
  // we first need to find the closest intersection between the ray and the scene objects
  const intersection: SceneIntersection | null = closestIntersection(
    cameraPOS,
    rotatedD,
    dotVectorsV3(rotatedD, rotatedD),
    minT,
    maxT,
    scenePayload,
    viewportDistance,
  );

  // return default background color if no intersection
  if (!intersection) return CANVAS_DEFAULT_BACKGROUND;

  // debug flag = early return, return the intersection color - no lighting
  if (scenePayload.debug && intersection.debug) return intersection.object.color;

  // apply lighting to the closest intersection to the camera
  const lightIntensity: number = computeLighting(
    intersection.position,
    intersection.normal,
    scaleVectorV3(rotatedD, -1),
    intersection.object.specular,
    scenePayload,
    viewportDistance,
  );

  // compute the local color, scale color by intensity of light
  const localColor: RGB = scaleVectorV3(intersection.object.color, lightIntensity);

  // if an object is not reflective or we hit our recur limit, return local color
  const reflective: number = intersection.object.reflective;
  if (recurLeft <= 0 || reflective <= 0) return localColor;

  // otherwise compute the reflected color
  const R: Vec3 = reflectVector(scaleVectorV3(rotatedD, -1), intersection.normal);
  const reflectedColor: RGB = traceRay(
    intersection.position,
    R,
    MIN_T,
    Number.POSITIVE_INFINITY,
    recurLeft - 1,
    scenePayload,
    viewportDistance,
  );

  // aggregate color data for reflection + local color
  const localContribution: RGB = scaleVectorV3(localColor, 1 - reflective);
  const reflectedContribution: RGB = scaleVectorV3(reflectedColor, reflective);

  // sum the two values to produce the output value
  return addVectors(localContribution, reflectedContribution);
}
