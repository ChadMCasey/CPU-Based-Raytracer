import { Vec3 } from "./types.js";

// Canvas
export const CANVAS_DEFAULT_BACKGROUND: Vec3 = [0, 0, 0];
// export const CANVAS_HEIGHT: number = 441;
export const CANVAS_HEIGHT: number = 150;

// aspect ratio
export const ASPECT_RATIO = (): number => {
  return window.innerWidth / window.innerHeight;
};

// Camera
export const CAMERA_POS: Vec3 = [0, 0, 0];

// Minimal T for shadow determination
export const MIN_T = 0.001;

// Recursive bound on reflection computation
export const MAX_REFLECT_RECUR = 3;
