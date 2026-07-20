import Light from "./Light.js";
export default class AmbientLight extends Light {
    constructor(intensity) {
        super("Ambient", intensity);
    }
    computeIllumination(P, N, V, s) {
        return this.intensity;
    }
    getShadowProperties(P) {
        return null;
    }
}
