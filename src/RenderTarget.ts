import { Vec2, Vec3 } from "./types";

// The canvas is a render target in the context of the web
export default class RenderTarget {
  public readonly canvas = document.getElementById(
    "canvas",
  ) as HTMLCanvasElement;
  public readonly context = this.canvas.getContext(
    "2d",
  ) as CanvasRenderingContext2D;
  public readonly width = this.canvas.width;
  public readonly height = this.canvas.height;

  putPixel(x: number, y: number, color: Vec3): void {
    this.context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
    this.context.fillRect(x, y, 1, 1);
  }

  // coodinate system conversion to 2D cartesian plane
  canvasCoordConversion(Cx: number, Cy: number): Vec2 {
    const Sx: number = this.width / 2 + Cx;
    const Sy: number = this.height / 2 - Cy;
    return [Sx, Sy];
  }
}
