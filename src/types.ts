
// a vector of 2 numerical values
export type Vec2 = [number, number];

// a vector of 3 numerical values
export type Vec3 = [number, number, number];

// an RGB value 
export type RGB = [number, number, number];

// sphere representation
export interface Sphere {
  center: Vec3,
  radius: number,
  color: RGB
}