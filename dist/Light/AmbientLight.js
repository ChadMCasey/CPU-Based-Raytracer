import Light from "./Light.js";
export default class AmbientLight extends Light {
    constructor(intensity, color) {
        super("Ambient", intensity, color);
    }
    computeIllumination(P, N, V, s) {
        return this.intensity;
    }
    getShadowProperties(P) {
        return null;
    }
    serialize() {
        return {
            type: "ambient",
            color: this.color,
            intensity: this.intensity,
        };
    }
}
