import Light from "./Light.js";
import MathUtils from "./MathUtils.js";
const mathUtils = new MathUtils();
export default class PointLight extends Light {
    constructor(intensity, position) {
        super("Point", intensity);
        this.position = position;
    }
    computeIllumination(P, N, V, s) {
        const L = mathUtils.subtractVectors(this.position, P);
        const DotNL = mathUtils.dotVectors(N, L);
        if (DotNL < 0)
            return 0;
        const diffuseScalar = this.computeScalarDiffuse(N, L, DotNL);
        const specularScalar = this.computeScalarHighlight(N, V, s, L);
        const totalScalar = (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
        const totalContributedIllumination = totalScalar * this.intensity;
        return totalContributedIllumination;
    }
    computeScalarDiffuse(N, L, DotNL) {
        return DotNL / (mathUtils.magnitude(L) * mathUtils.magnitude(N));
    }
    computeScalarHighlight(N, V, s, L) {
        if (s === -1)
            return -1;
        const R = mathUtils.reflectVector(L, N);
        const RDotV = mathUtils.dotVectors(R, V);
        if (RDotV < 0)
            return -1;
        const magR = mathUtils.magnitude(R);
        const magV = mathUtils.magnitude(V);
        const cosA = RDotV / (magR * magV);
        const specularScalar = cosA ** s;
        return specularScalar;
    }
    getShadowProperties(P) {
        return [mathUtils.subtractVectors(this.position, P), 1];
    }
}
