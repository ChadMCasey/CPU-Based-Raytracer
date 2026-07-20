import Light from "./Light.js";
import MathUtils from "../Utils/MathUtils.js";
const mathUtils = new MathUtils();
export default class DirectionalLight extends Light {
    constructor(intensity, direction) {
        super("Directional", intensity);
        this.direction = direction;
    }
    computeIllumination(P, N, V, s) {
        const DotNL = mathUtils.dotVectors(N, this.direction);
        if (DotNL < 0)
            return 0;
        const diffuseScalar = this.computeScalarDiffuse(N, this.direction, DotNL);
        const specularScalar = this.computeScalarHighlight(N, V, s, this.direction);
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
        return [this.direction, Number.POSITIVE_INFINITY];
    }
}
