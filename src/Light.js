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
    computeIllumination(P, N, V, s) {
        return this.intensity;
    }
}
export class PointLight extends Light {
    constructor(intensity, position) {
        super('Point', intensity);
        this.position = position;
    }
    computeIllumination(P, N, V, s) {
        const L = mathUtils.subtractVectors(this.position, P);
        const DotNL = mathUtils.dotVectors(L, N);
        if (DotNL < 0) // dont contribute negative light
            return 0;
        let diffuseScalar = DotNL / (mathUtils.magnitude(L) * mathUtils.magnitude(N));
        if (s === -1) // dont add specular highlights
            return diffuseScalar * this.intensity;
        const TwoN = mathUtils.scaleVector(N, 2);
        const ScaleTwoN = mathUtils.scaleVector(TwoN, DotNL);
        const R = mathUtils.subtractVectors(ScaleTwoN, L);
        const RDotV = mathUtils.dotVectors(R, V);
        // ensure that our angle between View vector V 
        // and reflection vector R does not exceed 90 deg
        if (RDotV < 0)
            return diffuseScalar * this.intensity;
        const magR = mathUtils.magnitude(R);
        const magV = mathUtils.magnitude(V);
        const cosA = RDotV / (magR * magV);
        const specularScalar = cosA ** s;
        const totalScalar = specularScalar + diffuseScalar;
        return totalScalar * this.intensity;
    }
}
export class DirectionalLight extends Light {
    constructor(intensity, direction) {
        super('Directional', intensity);
        this.direction = direction;
    }
    computeIllumination(P, N, V, s) {
        const DotNL = mathUtils.dotVectors(N, this.direction);
        if (DotNL < 0) // dont contribute negative light 
            return 0;
        const diffuseScalar = DotNL / (mathUtils.magnitude(N) * mathUtils.magnitude(this.direction));
        if (s === -1) // dont add specular highlights
            return diffuseScalar * this.intensity;
        const TwoN = mathUtils.scaleVector(N, 2);
        const ScaleTwoN = mathUtils.scaleVector(TwoN, DotNL);
        const R = mathUtils.subtractVectors(ScaleTwoN, this.direction);
        const RDotV = mathUtils.dotVectors(R, V);
        // ensure that our angle between View vector V 
        // and reflection vector R does not exceed 90 deg
        if (RDotV < 0)
            return diffuseScalar * this.intensity;
        const magR = mathUtils.magnitude(R);
        const magV = mathUtils.magnitude(V);
        const cosA = RDotV / (magR * magV);
        const specularScalar = cosA ** s;
        const totalScalar = specularScalar + diffuseScalar;
        return totalScalar * this.intensity;
    }
}
