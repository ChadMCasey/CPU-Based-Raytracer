
// a vector of 2 numerical values
export type Vec2 = [number, number];

// a vector of 3 numerical values
export type Vec3 = [number, number, number];

// an RGB value 
export type RGB = [number, number, number];

export type HitRecord = {
  distance: number;
}

// every object in the scene can be intersected by a ray
export interface SceneObject {
  readonly color: RGB,
  intersect(origin: Vec3, direction: Vec3): HitRecord | null;
}

// sphere representation
export interface Sphere {
  center: Vec3,
  radius: number,
  color: RGB
}

// generic light representation
export interface Light {
  type: "directional" | "point" | "ambient";
  intensity: number;
}
