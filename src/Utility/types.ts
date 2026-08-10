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
  halfTargetWidth: number;
  halfTargetHeight: number;
  viewportScaleX: number;
  viewportScaleY: number;
  viewportDistance: number;
};

// a generic scene intersection
export type SceneIntersection = {
  distance: number;
  position: Vec3;
  normal: Vec3;
  object: Primitive;
  debug?: boolean;
};

export type Camera = {
  position: Vec3;
  rotation: Rotation;
  rotationMatrix: number[][];
  rotationChanged: boolean;
  viewportWidth: number;
  viewportHeight: number;
  viewportDistance: number;
};

export type Rotation = {
  pitch: number;
  yaw: number;
  roll: number;
};

export type SceneData = {
  lights: Light[];
  primatives: Primitive[];
  bvh: BVHNode | null;
};

export type ScenePayload = {
  sceneData: SceneData;
  cameraPOS: Vec3;
  cameraRotation: number[][];
  debug: boolean;
};

// serialized sphere
export type Sphere = {
  type: "sphere";
  center: [number, number, number];
  bounds: Bounds;
  r: number;
  rSquared: number;
  color: RGB;
  specular: number;
  reflective: number;
};

export type Triangle = {
  type: "triangle";
  V1: Vec3;
  V2: Vec3;
  V3: Vec3;
  bounds: Bounds;
  edges: Edges;
  color: RGB;
  specular: number;
  reflective: number;
  normal: Vec3;
  planeDistance: number;
};

export type BVHNode = {
  type: "BVHNode";
  left: BVHNode | null;
  right: BVHNode | null;
  splitAxis: number;
  bounds: Bounds;
  primitives: Primitive[] | null;
  reflective: number;
  specular: number;
  color: RGB;
};

export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

export type Edges = {
  E1: Vec3;
  E2: Vec3;
  E3: Vec3;
};

export type LightType = "directional" | "point" | "ambient";

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

export type Primitive = Sphere | Triangle | BVHNode;
export type Light = AmbientLight | DirectionLight | PointLight;
