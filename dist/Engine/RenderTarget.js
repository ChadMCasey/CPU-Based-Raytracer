import { CANVAS_HEIGHT, ASPECT_RATIO } from "../Configuration/constants.js";
// The canvas is a render target in the context of the web
export default class RenderTarget {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        // determine camera dimensions based off browser window aspect ratio
        this.canvas.height = CANVAS_HEIGHT;
        this.canvas.width = Math.floor(ASPECT_RATIO() * CANVAS_HEIGHT);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        // compute shared array buffer with 4 bytes per pixel
        const bytes = this.width * this.height * 4;
        const sharedArrayBuffer = new SharedArrayBuffer(bytes);
        this.sharedArrayBuffer = new Uint8ClampedArray(sharedArrayBuffer);
    }
    // write color data into shared array buffer
    writeColorToBuffer(x, y, color) {
        const bufferIndexR = this.computeSharedArrayIndex(x, y);
        this.sharedArrayBuffer[bufferIndexR] = color[0]; // R
        this.sharedArrayBuffer[bufferIndexR + 1] = color[1]; // G
        this.sharedArrayBuffer[bufferIndexR + 2] = color[2]; // B
        this.sharedArrayBuffer[bufferIndexR + 3] = 1; // A
    }
    // coodinate system conversion to 2D cartesian plane
    canvasCoordConversion(Cx, Cy) {
        const Sx = this.width / 2 + Cx;
        const Sy = this.height / 2 - Cy;
        return [Sx, Sy];
    }
    // flatten 2d index into 1d index for shared array buffer
    computeSharedArrayIndex(row, column) {
        return (this.width * row + column) * 4;
    }
    // write shared array buffer data into context
    updateScreen(Dx = 0, Dy = 0) {
        const clampedArray = new Uint8ClampedArray(this.sharedArrayBuffer);
        const imageData = new ImageData(clampedArray, this.width, this.height);
        this.context.putImageData(imageData, Dx, Dy);
    }
}
