// The canvas is a render target in the context of the web
export default class RenderTarget {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    putPixel(x, y, color) {
        this.context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
        this.context.fillRect(x, y, 1, 1);
    }
    // coodinate system conversion to 2D cartesian plane
    canvasCoordConversion(Cx, Cy) {
        const Sx = this.width / 2 + Cx;
        const Sy = this.height / 2 - Cy;
        return [Sx, Sy];
    }
}
