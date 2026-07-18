import Light from './Light.js';
import MathUtils from './MathUtils.js';
const mathUtils = new MathUtils();
export default class DirectionalLight extends Light {
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
