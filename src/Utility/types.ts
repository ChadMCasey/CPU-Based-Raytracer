// a vector of 2 numerical values
export type Vec2 = [number, number];

// a vector of 3 numerical values
export type Vec3 = [number, number, number];

// an RGB value
export type RGB = [number, number, number];

// specifucally a hit from camera to an object in the scene
export type HitRecord = {
  distance: number;
  position: Vec3;
  normal: Vec3;
};

export type Task = {
  startX: number;
  startY: number;
  width: number;
  height: number;
  targetWidth: number;
  targetHeight: number;
  viewportWidth: number;
  viewportHeight: number;
};

// a generic scene intersection
export type SceneIntersection = {
  distance: number;
  position: Vec3;
  normal: Vec3;
  object: Primative;
};

// every object in the scene can be intersected by a ray
// export interface SceneObject {
//   readonly color: RGB;
//   readonly specular: number;
//   readonly reflective: number;
//   intersect(origin: Vec3, direction: Vec3): HitRecord | null;
//   serialize(): Primative;
// }

export type Rotation = {
  pitch: number;
  yaw: number;
  roll: number;
};

export type SceneData = {
  lights: Light[];
  primatives: Primative[];
};

export type ScenePayload = {
  sceneData: SceneData;
  cameraPOS: Vec3;
  cameraRotation: number[][];
};

// serialized sphere
export type Sphere = {
  type: "sphere";
  center: [number, number, number];
  radius: number;
  color: [number, number, number];
  specular: number;
  reflective: number;
};

// LIGHTING
export type DirectionLight = {
  type: "directional";
  direction: [number, number, number];
  intensity: number;
  color: [number, number, number];
  maxT: number;
};

export type PointLight = {
  type: "point";
  position: [number, number, number];
  intensity: number;
  color: [number, number, number];
};

export type AmbientLight = {
  type: "ambient";
  intensity: number;
  color: [number, number, number];
};

export type Primative = Sphere;
export type Light = AmbientLight | DirectionLight | PointLight;
