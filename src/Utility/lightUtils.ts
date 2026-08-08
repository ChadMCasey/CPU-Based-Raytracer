import { Vec3, ScenePayload, PointLight, Light, SceneIntersection, DirectionLight } from "./types";
import { reflectVector, dotVectorsV3, magnitudeV3, subtractVectors, closestIntersection } from "./mathUtils";
import { MIN_T } from "./constants";

export function computeLighting(
  P: Vec3,
  N: Vec3,
  V: Vec3,
  specular: number,
  scenePayload: ScenePayload,
  viewportDistance: number,
): number {
  let intensity: number = 0.0;

  for (let light of scenePayload.sceneData.lights) {
    switch (light.type) {
      case "ambient":
        intensity += computeAmbientLighting(light);
        break;
      case "directional":
        intensity += computeDirectionalLighting(P, N, V, specular, light, scenePayload, viewportDistance);
        break;
      case "point":
        intensity += computePointLighting(P, N, V, specular, light, scenePayload, viewportDistance);
        break;
    }
  }

  return intensity;
}

export function computeAmbientLighting(light: Light) {
  return light.intensity;
}

export function computeDirectionalLighting(
  P: Vec3,
  N: Vec3,
  V: Vec3,
  specular: number,
  light: DirectionLight,
  scenePayload: ScenePayload,
  viewportDistance: number,
) {
  // shadow properties
  const lightDirectionFromP: Vec3 = light.direction;
  const maxT: number = light.maxT;

  // compute closest intersection between P and light
  const lightObstruction: SceneIntersection | null = closestIntersection(
    P,
    lightDirectionFromP,
    dotVectorsV3(lightDirectionFromP, lightDirectionFromP),
    MIN_T,
    maxT,
    scenePayload,
    viewportDistance,
  );

  // no obstruction so add in lighting
  if (!lightObstruction) {
    const DotNL = dotVectorsV3(N, lightDirectionFromP);

    if (DotNL < 0) return 0;

    const diffuseScalar: number = computeDirectionalScalarDiffuse(N, lightDirectionFromP, DotNL);
    const specularScalar: number = computeDirectionalScalarHighlight(N, V, specular, lightDirectionFromP);

    const totalScalar: number = (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
    const totalContributedIllumination: number = totalScalar * light.intensity;

    return totalContributedIllumination;
  }

  // for now obstruction means no contributed light
  return 0;
}

function computeDirectionalScalarDiffuse(N: Vec3, L: Vec3, DotNL: number): number {
  return DotNL / (magnitudeV3(L) * magnitudeV3(N));
}

function computeDirectionalScalarHighlight(N: Vec3, V: Vec3, s: number, L: Vec3): number {
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
  viewportDistance: number,
): number {
  // shadow properties
  const lightDirectionFromP: Vec3 = subtractVectors(light.position, P);
  const maxT: number = 1;

  // compute closest intersection between P and light
  const lightObstruction: SceneIntersection | null = closestIntersection(
    P,
    lightDirectionFromP,
    dotVectorsV3(lightDirectionFromP, lightDirectionFromP),
    MIN_T,
    maxT,
    scenePayload,
    viewportDistance,
  );

  // no obstruction so add in lighting
  if (!lightObstruction) {
    const L: Vec3 = subtractVectors(light.position, P);
    const DotNL: number = dotVectorsV3(N, L);

    if (DotNL < 0) return 0;

    const diffuseScalar: number = computePointScalarDiffuse(N, L, DotNL);
    const specularScalar: number = computePointScalarHighlight(N, V, s, L);

    const totalScalar: number = (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
    const totalContributedIllumination: number = totalScalar * light.intensity;

    return totalContributedIllumination;
  }

  // for now obstruction means no contributed light
  return 0;
}

export function computePointScalarHighlight(N: Vec3, V: Vec3, s: number, L: Vec3): number {
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

export function computePointScalarDiffuse(N: Vec3, L: Vec3, DotNL: number): number {
  return DotNL / (magnitudeV3(L) * magnitudeV3(N));
}
