import { Vec3, Rotation } from "./types";

// Canvas
export const CANVAS_DEFAULT_BACKGROUND: Vec3 = [10, 10, 10];
export const CANVAS_HEIGHT: number = 320;

// aspect ratio
export const ASPECT_RATIO = (): number => {
  return window.innerWidth / window.innerHeight;
};

// Minimal T for shadow determination
export const MIN_T: number = 0.00001;

// Recursive bound on reflection computation
export const MAX_REFLECT_RECUR: number = 1;

export const VALID_MOVEMENT_KEYS: string[] = ["w", "a", "s", "d"];
export const CAMERA_MOVEMENT_SPEED: number = 2.5;
export const CAMERA_ORIENTATION_SPEED: number = 0.2;

// viewport defaults
export const VIEWPORT_DISTANCE: number = 1;
export const VIEWPORT_HEIGHT: number = 1;

// Camera defaults
export const CAMERA_POS: Vec3 = [0, 0, 0];
export const CAMERA_ROTATION: Rotation = { pitch: 0, yaw: 0, roll: 0 };
export const CAMERA_ROTATION_MATRIX: number[][] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

// canvas partition
export const BANDS: number = 20;
