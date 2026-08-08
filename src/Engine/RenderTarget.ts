import { CANVAS_HEIGHT, ASPECT_RATIO } from "../Utility/constants";

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
    this.sharedArrayBuffer = new Uint8ClampedArray(
      new SharedArrayBuffer(bytes),
    );
  }

  // write shared array buffer data into context
  updateScreen = (Dx: number = 0, Dy: number = 0): void => {
    const clampedArray = new Uint8ClampedArray(this.sharedArrayBuffer);
    const imageData = new ImageData(clampedArray, this.width, this.height);
    this.context.putImageData(imageData, Dx, Dy);
  };
}
