// Canvas
export const CANVAS_DEFAULT_BACKGROUND = [0, 0, 0];
export const CANVAS_HEIGHT = 200;
// aspect ratio
export const ASPECT_RATIO = () => {
    return window.innerWidth / window.innerHeight;
};
// Minimal T for shadow determination
export const MIN_T = 0.001;
// Recursive bound on reflection computation
export const MAX_REFLECT_RECUR = 3;
// Camera defaults
export const CAMERA_POS = [0, 0, 0];
export const CAMERA_ORIENTATION = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
];
export const VALID_MOVEMENT_KEYS = ["w", "a", "s", "d"];
export const CAMERA_MOVEMENT_SPEED = 2.5;
export const CAMERA_ORIENTATION_SPEED = 0.15;
