import { Vec2, Vec3 } from "../Utility/types.js";
import { CANVAS_HEIGHT, ASPECT_RATIO } from "../Utility/constants.js";

// The canvas is a render target in the context of the web
export default class RenderTarget {
  readonly canvas = document.getElementById("canvas") as HTMLCanvasElement;
  readonly context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

  readonly width: number;
  readonly height: number;

  public readonly sharedArrayBuffer: Uint8ClampedArray;

  constructor() {
    // determine camera dimensions based off browser window aspect ratio
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.width = Math.floor(ASPECT_RATIO() * CANVAS_HEIGHT);

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // compute shared array buffer with 4 bytes per pixel
    const bytes = this.width * this.height * 4;
    this.sharedArrayBuffer = new Uint8ClampedArray(new SharedArrayBuffer(bytes));
  }

  // write color data into shared array buffer
  writeColorToBuffer(x: number, y: number, color: Vec3): void {
    const bufferIndexR = this.computeSharedArrayIndex(x, y);
    this.sharedArrayBuffer[bufferIndexR] = color[0]; // R
    this.sharedArrayBuffer[bufferIndexR + 1] = color[1]; // G
    this.sharedArrayBuffer[bufferIndexR + 2] = color[2]; // B
    this.sharedArrayBuffer[bufferIndexR + 3] = 255; // A
  }

  // coodinate system conversion to 2D cartesian plane
  canvasCoordConversion(Cx: number, Cy: number): Vec2 {
    const Sx: number = this.width / 2 + Cx;
    const Sy: number = this.height / 2 - Cy;
    return [Sx, Sy];
  }

  // flatten 2d index into 1d index for shared array buffer
  computeSharedArrayIndex(row: number, column: number): number {
    return (this.width * row + column) * 4;
  }

  // write shared array buffer data into context
  updateScreen = (Dx: number = 0, Dy: number = 0): void => {
    const clampedArray = new Uint8ClampedArray(this.sharedArrayBuffer);
    const imageData = new ImageData(clampedArray, this.width, this.height);
    this.context.putImageData(imageData, Dx, Dy);
  };
}
