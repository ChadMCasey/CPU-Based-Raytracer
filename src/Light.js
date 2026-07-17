import MathUtils from "./MathUtils.js";
const mathUtils = new MathUtils();
export class Light {
    constructor(type, intensity) {
        this.intensity = intensity;
        this.type = type;
    }
}
export class AmbientLight extends Light {
    constructor(intensity) {
        super('Ambient', intensity);
    }
    computeIllumination(P, N) {
        return this.intensity;
    }
}
export class PointLight extends Light {
    constructor(intensity, position) {
        super('Point', intensity);
        this.position = position;
    }
    computeIllumination(P, N) {
        const L = mathUtils.subtractVectors(this.position, P);
        const dot = mathUtils.dotVectors(L, N);
        if (dot < 0) // dont contribute negative light
            return 0;
        const scalarOnI = dot / (mathUtils.magnitude(L) * mathUtils.magnitude(N));
        return scalarOnI * this.intensity;
    }
}
export class DirectionalLight extends Light {
    constructor(intensity, direction) {
        super('Directional', intensity);
        this.direction = direction;
    }
    computeIllumination(P, N) {
        const dot = mathUtils.dotVectors(N, this.direction);
        if (dot < 0) // dont contribute negative light 
            return 0;
        const scalarOnI = dot / (mathUtils.magnitude(N) * mathUtils.magnitude(this.direction));
        return scalarOnI * this.intensity;
    }
}
