import { Vec3, SceneObject, HitRecord, SceneIntersection, RGB } from "../Utility/types";
import { CANVAS_DEFAULT_BACKGROUND, MIN_T } from "../Utility/constants";
import Sphere from "../Primitives/Sphere";
import MathUtils from "../Utility/MathUtils";
import Light from "../Light/Light";
import AmbientLight from "../Light/AmbientLight";
import DirectionalLight from "../Light/DirectionalLight";
import PointLight from "../Light/PointLight";

const mathUtils = new MathUtils();

export default class Scene {
  private spheres: Sphere[] = [
    new Sphere([0, -1, 3], 1, [255, 0, 0], 500, 0.2), // Red
    new Sphere([2, 0, 4], 1, [0, 0, 255], 500, 0.3), // Blue
    new Sphere([-2, 0, 4], 1, [0, 255, 0], 10, 0.4), // Green
    new Sphere([0, -5001, 0], 5000, [255, 255, 255], 1000, 0.5), // white
  ];

  public readonly lights: Light[] = [
    new AmbientLight(0.2, [255, 255, 255]),
    new DirectionalLight(0.2, [1, 4, 4], [255, 255, 255]),
    new PointLight(0.6, [2, 1, 0], [255, 255, 255]),
  ];

  public readonly sceneObjs: SceneObject[] = [...this.spheres];

  // traceRay(O: Vec3, D: Vec3, minT: number, maxT: number, RecurAmt: number): Vec3 {
  //   // find the intersection between orignation O and closest scene object
  //   const intersection: SceneIntersection | null = this.closestIntersection(O, D, minT, maxT);

  //   if (!intersection) return CANVAS_DEFAULT_BACKGROUND;

  //   // apply lighting to the closest intersection to the camera
  //   const lightIntensity = this.computeLighting(
  //     intersection.position,
  //     intersection.normal,
  //     MathUtils.scaleVectorV3(D, -1),
  //     intersection.object.specular,
  //   );

  //   const localColor: RGB = MathUtils.scaleVectorV3(intersection.object.color, lightIntensity);

  //   // if we recur limit or the object is not reflective at all..
  //   const reflective: number = intersection.object.reflective;
  //   if (RecurAmt <= 0 || reflective <= 0) return localColor;

  //   // otherwise compute the reflected color
  //   const R: Vec3 = MathUtils.reflectVector(MathUtils.scaleVectorV3(D, -1), intersection.normal);
  //   const reflectedColor: RGB = this.traceRay(
  //     intersection.position,
  //     R,
  //     MIN_T,
  //     Number.POSITIVE_INFINITY,
  //     RecurAmt - 1,
  //   );

  //   // aggregate color data for reflection + local color
  //   const localContribution: RGB = MathUtils.scaleVectorV3(localColor, 1 - reflective);
  //   const reflectedContribution: RGB = MathUtils.scaleVectorV3(reflectedColor, reflective);

  //   // sum the two values to produce the output value
  //   return MathUtils.addVectors(localContribution, reflectedContribution);
  // }

  // closestIntersection(O: Vec3, D: Vec3, minT: number, maxT: number): SceneIntersection | null {
  //   let closestT: number = Number.POSITIVE_INFINITY;
  //   let closestHit: SceneIntersection | null = null;

  //   for (let i = 0; i < this.sceneObjs.length; i++) {
  //     const sceneObj = this.sceneObjs[i];

  //     const intersection: HitRecord | null = sceneObj.intersect(O, D);

  //     if (!intersection) continue;

  //     if (
  //       intersection.distance >= minT &&
  //       intersection.distance <= maxT &&
  //       intersection.distance < closestT
  //     ) {
  //       closestT = intersection.distance;
  //       closestHit = {
  //         distance: intersection.distance,
  //         position: intersection.position,
  //         normal: intersection.normal,
  //         object: sceneObj,
  //       };
  //     }
  //   }

  //   return closestHit;
  // }

  // computeLighting(P: Vec3, N: Vec3, V: Vec3, s: number) {
  //   let intensity: number = 0.0;

  //   for (let light of this.lights) {
  //     const shadowProps = light.getShadowProperties(P);

  //     // no shadow props, add ambient light as is
  //     if (!shadowProps) {
  //       intensity += light.computeIllumination(P, N, V, s);
  //       continue;
  //     }

  //     // do we have an intersection between us and the light?
  //     const [lightDirectionFromP, maxT] = shadowProps;
  //     const obstruction = this.closestIntersection(P, lightDirectionFromP, MIN_T, maxT);

  //     // no intersection, means the light has made it to P unimpeded
  //     if (!obstruction) {
  //       intensity += light.computeIllumination(P, N, V, s);
  //     }
  //   }
  //   return intensity;
  // }
}
