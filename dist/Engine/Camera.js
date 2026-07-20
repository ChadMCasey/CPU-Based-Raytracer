export default class Camera {
    constructor(position) {
        this.viewportWidth = 1;
        this.viewportHeight = 1;
        this.viewportDistance = 1;
        this.position = position; // starting position.
    }
    // i am looking at a 2D coordinate, please provide me a three dimensional direction ray
    canvasToViewportCoord(Cw, Ch, Cx, Cy) {
        const Vx = (this.viewportWidth / Cw) * Cx;
        const Vy = (this.viewportHeight / Ch) * Cy;
        const Vz = this.viewportDistance;
        return [Vx, Vy, Vz];
    }
}
