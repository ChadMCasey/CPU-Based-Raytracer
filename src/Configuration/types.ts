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

// a generic scene intersection
export type SceneIntersection = {
  distance: number;
  position: Vec3;
  normal: Vec3;
  object: SceneObject;
};

// every object in the scene can be intersected by a ray
export interface SceneObject {
  readonly color: RGB;
  readonly specular: number;
  readonly reflective: number;
  intersect(origin: Vec3, direction: Vec3): HitRecord | null;
}

// sphere representation
export interface Sphere {
  center: Vec3;
  radius: number;
}

export type LightType = "Ambient" | "Directional" | "Point";
