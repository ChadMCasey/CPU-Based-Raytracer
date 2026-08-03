import { Vec3 } from "./types";

// Canvas
export const CANVAS_DEFAULT_BACKGROUND: Vec3 = [0, 0, 0];
export const CANVAS_HEIGHT: number = 240;

// aspect ratio
export const ASPECT_RATIO = (): number => {
  return window.innerWidth / window.innerHeight;
};

// Minimal T for shadow determination
export const MIN_T: number = 0.001;

// Recursive bound on reflection computation
export const MAX_REFLECT_RECUR: number = 3;

export const VALID_MOVEMENT_KEYS: string[] = ["w", "a", "s", "d"];
export const CAMERA_MOVEMENT_SPEED: number = 2.5;
export const CAMERA_ORIENTATION_SPEED: number = 0.2;

// canvas partition
export const BANDS: number = 20;
