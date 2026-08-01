import { MAX_REFLECT_RECUR, CANVAS_DEFAULT_BACKGROUND, MIN_T } from "../Utility/constants";
import MathUtils from "../Utility/MathUtils";
self.addEventListener("message", (event) => {
    const serializedScene = event.data.serializedScene;
    const sharedArrayBuffer = event.data.sharedArrayBuffer;
    const { startX, startY, width, height, targetWidth, targetHeight, viewportWidth, viewportHeight } = event.data.openTask;
    const uint8ClampedArray = new Uint8ClampedArray(sharedArrayBuffer);
    // iterate section of render target upon which our calculations will be done
    for (let y = startY; y < startY + height; y++) {
        for (let x = startX; x < startX + width; x++) {
            // transform (x,y) into coordinates defined by a 2d cartesian plane
            const [cartX, cartY] = mapToCartesianPoints(targetWidth, targetHeight, x, y);
            // compute D from the origin to the point on the viewport
            const rawD = computeDirectionalVector(targetWidth, targetHeight, viewportWidth, viewportHeight, cartX, cartY);
            // rotate D to account for camera rotation
            const rotatedD = MathUtils.multiplyDirectionByRotation(serializedScene.cameraRotation, rawD);
            // trace ray (this will originate D from the cameras position)
            const computedColor = traceRay(serializedScene.cameraPOS, rotatedD, 1, Number.POSITIVE_INFINITY, MAX_REFLECT_RECUR, serializedScene);
            // write color data to buffer
            writeColorDataToBuffer(uint8ClampedArray, computedColor, targetWidth, x, y);
        }
    }
    // dispatch response to let app know that task is completed
    self.postMessage({});
});
function writeColorDataToBuffer(sharedArrayBuffer, color, width, column, row) {
    // compute pixel index within shared array buffer
    const index = (width * row + column) * 4;
    // write color data into buffer
    sharedArrayBuffer[index] = color[0]; // R
    sharedArrayBuffer[index + 1] = color[1]; // G
    sharedArrayBuffer[index + 2] = color[2]; // B
    sharedArrayBuffer[index + 3] = 255; // A
}
// mapp x to 2D cartesian X
function mapToCartesianPoints(targetW, targetH, x, y) {
    let cartX, cartY;
    cartX = x - targetW / 2;
    cartY = targetH / 2 - y;
    return [cartX, cartY];
}
// compute directional D raw (scale and place 1 unit away at VP)
function computeDirectionalVector(Tw, Th, Vw, Vh, cartX, cartY) {
    const Vx = (Vw / Tw) * cartX;
    const Vy = (Vh / Th) * cartY;
    const Vz = 1;
    return [Vx, Vy, Vz];
}
// trace the ray and return a color for the pixel
function traceRay(cameraPOS, rotatedD, minT, maxT, recurLeft, serializedScene) {
    // we first need to find the closest intersection between the ray and the scene objects
    const intersection = closestIntersection(cameraPOS, rotatedD, minT, maxT, serializedScene);
    // return default background color if no intersection
    if (!intersection)
        return CANVAS_DEFAULT_BACKGROUND;
    // apply lighting to the closest intersection to the camera
    const lightIntensity = computeLighting(intersection.position, intersection.normal, MathUtils.scaleVectorV3(rotatedD, -1), intersection.object.specular, serializedScene);
    // compute the local color, scale color by intensity of light
    const localColor = MathUtils.scaleVectorV3(intersection.object.color, lightIntensity);
    // if an object is not reflective or we hit our recur limit, return local color
    const reflective = intersection.object.reflective;
    if (recurLeft <= 0 || reflective <= 0)
        return localColor;
    // otherwise compute the reflected color
    const R = MathUtils.reflectVector(MathUtils.scaleVectorV3(rotatedD, -1), intersection.normal);
    const reflectedColor = traceRay(intersection.position, R, MIN_T, Number.POSITIVE_INFINITY, recurLeft - 1, serializedScene);
    // aggregate color data for reflection + local color
    const localContribution = MathUtils.scaleVectorV3(localColor, 1 - reflective);
    const reflectedContribution = MathUtils.scaleVectorV3(reflectedColor, reflective);
    // sum the two values to produce the output value
    return MathUtils.addVectors(localContribution, reflectedContribution);
}
function closestIntersection(O, D, minT, maxT, serializedScene) {
    let closestT = Number.POSITIVE_INFINITY;
    let closestIntersection = null;
    for (let object of serializedScene.sceneObjects) {
        const intersection = computeIntersection(O, D, object);
        if (!intersection)
            continue;
        if (intersection.distance >= minT && intersection.distance <= maxT) {
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
function computeIntersection(O, D, object) {
    switch (object.type) {
        case "sphere":
            return computeSphereIntersection(O, D, object);
    }
}
function computeSphereIntersection(O, D, sphere) {
    const r = sphere.radius;
    const CO = MathUtils.subtractVectors(O, sphere.center);
    const a = MathUtils.dotVectorsV3(D, D);
    const b = 2 * MathUtils.dotVectorsV3(CO, D);
    const c = MathUtils.dotVectorsV3(CO, CO) - r * r;
    const discriminantSquared = b ** 2 - 4 * a * c;
    if (discriminantSquared < 0)
        return null; // NO INTERSECTION
    const discriminant = Math.sqrt(b ** 2 - 4 * a * c);
    const intersections = [(-b + discriminant) / (2 * a), (-b - discriminant) / (2 * a)];
    const validIntersections = intersections.filter((t) => t > 0);
    if (!validIntersections.length)
        return null;
    const distance = Math.min(...validIntersections);
    const position = MathUtils.addVectors(O, MathUtils.scaleVectorV3(D, distance)); // P = O + t(V - O);
    const normal = computeNormal(position, sphere);
    return { distance, position, normal };
}
function computeNormal(position, sphere) {
    const CP = MathUtils.subtractVectors(position, sphere.center);
    const magnitude = MathUtils.magnitudeV3(CP);
    const normal = MathUtils.scaleVectorV3(CP, 1 / magnitude);
    return normal;
}
function computeLighting(P, N, V, specular, scene) {
    let intensity = 0.0;
    for (let light of scene.sceneLights) {
        switch (light.type) {
            case "ambient":
                intensity += computeAmbientLighting(light);
                break;
            case "directional":
                intensity += computeDirectionalLighting(P, N, V, specular, light, scene);
                break;
            case "point":
                intensity += computePointLighting(P, N, V, specular, light, scene);
                break;
        }
    }
    return intensity;
}
function computeAmbientLighting(light) {
    return light.intensity;
}
function computeDirectionalLighting(P, N, V, specular, light, scene) {
    // shadow properties
    const lightDirectionFromP = light.direction;
    const maxT = light.maxT;
    // compute closest intersection between P and light
    const lightObstruction = closestIntersection(P, lightDirectionFromP, MIN_T, maxT, scene);
    // no obstruction so add in lighting
    if (!lightObstruction) {
        const DotNL = MathUtils.dotVectorsV3(N, lightDirectionFromP);
        if (DotNL < 0)
            return 0;
        const diffuseScalar = computeDirectionalScalarDiffuse(N, lightDirectionFromP, DotNL);
        const specularScalar = computeDirectionalScalarHighlight(N, V, specular, lightDirectionFromP);
        const totalScalar = (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
        const totalContributedIllumination = totalScalar * light.intensity;
        return totalContributedIllumination;
    }
    // for now obstruction means no contributed light
    return 0;
}
function computeDirectionalScalarDiffuse(N, L, DotNL) {
    return DotNL / (MathUtils.magnitudeV3(L) * MathUtils.magnitudeV3(N));
}
function computeDirectionalScalarHighlight(N, V, s, L) {
    if (s === -1)
        return -1;
    const R = MathUtils.reflectVector(L, N);
    const RDotV = MathUtils.dotVectorsV3(R, V);
    if (RDotV < 0)
        return -1;
    const magR = MathUtils.magnitudeV3(R);
    const magV = MathUtils.magnitudeV3(V);
    const cosA = RDotV / (magR * magV);
    const specularScalar = cosA ** s;
    return specularScalar;
}
function computePointLighting(P, N, V, s, light, scene) {
    // shadow properties
    const lightDirectionFromP = MathUtils.subtractVectors(light.position, P);
    const maxT = 1;
    // compute closest intersection between P and light
    const lightObstruction = closestIntersection(P, lightDirectionFromP, MIN_T, maxT, scene);
    // no obstruction so add in lighting
    if (!lightObstruction) {
        const L = MathUtils.subtractVectors(light.position, P);
        const DotNL = MathUtils.dotVectorsV3(N, L);
        if (DotNL < 0)
            return 0;
        const diffuseScalar = computePointScalarDiffuse(N, L, DotNL);
        const specularScalar = computePointScalarHighlight(N, V, s, L);
        const totalScalar = (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
        const totalContributedIllumination = totalScalar * light.intensity;
        return totalContributedIllumination;
    }
    // for now obstruction means no contributed light
    return 0;
}
function computePointScalarDiffuse(N, L, DotNL) {
    return DotNL / (MathUtils.magnitudeV3(L) * MathUtils.magnitudeV3(N));
}
function computePointScalarHighlight(N, V, s, L) {
    if (s === -1)
        return -1;
    const R = MathUtils.reflectVector(L, N);
    const RDotV = MathUtils.dotVectorsV3(R, V);
    if (RDotV < 0)
        return -1;
    const magR = MathUtils.magnitudeV3(R);
    const magV = MathUtils.magnitudeV3(V);
    const cosA = RDotV / (magR * magV);
    const specularScalar = cosA ** s;
    return specularScalar;
}
