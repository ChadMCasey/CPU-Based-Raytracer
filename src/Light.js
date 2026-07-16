export class DirectionalLight {
    constructor(intensity, direction) {
        this.type = "directional";
        this.intensity = intensity;
        this.direction = direction;
    }
}
export class PointLight {
    constructor(intensity, position) {
        this.type = "point";
        this.intensity = intensity;
        this.position = position;
    }
}
export class AmbientLight {
    constructor(intensity) {
        this.type = "ambient";
        this.intensity = intensity;
    }
}
