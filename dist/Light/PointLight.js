import Light from "./Light.js";
import MathUtils from "../Utility/MathUtils.js";
const mathUtils = new MathUtils();
export default class PointLight extends Light {
    constructor(intensity, position, color) {
        super("Point", intensity, color);
        this.position = position;
    }
    computeIllumination(P, N, V, s) {
        const L = MathUtils.subtractVectors(this.position, P);
        const DotNL = MathUtils.dotVectorsV3(N, L);
        if (DotNL < 0)
            return 0;
        const diffuseScalar = this.computeScalarDiffuse(N, L, DotNL);
        const specularScalar = this.computeScalarHighlight(N, V, s, L);
        const totalScalar = (specularScalar === -1 ? 0 : specularScalar) + diffuseScalar;
        const totalContributedIllumination = totalScalar * this.intensity;
        return totalContributedIllumination;
    }
    computeScalarDiffuse(N, L, DotNL) {
        return DotNL / (MathUtils.magnitudeV3(L) * MathUtils.magnitudeV3(N));
    }
    computeScalarHighlight(N, V, s, L) {
        if (s === -1)
            return -1;
        const R = MathUtils.reflectVector(L, N);
        const RDotV = MathUtils.dotVectorsV3(R, V);
        if (RDotV < 0)
            return -1;
        const magR = MathUtils.magnitudeV3(R);
        const magV = MathUtils.magnitudeV3(V);
        const cosA = RDotV / (magR * magV);
        const specularScalar = cosA ** s;
        return specularScalar;
    }
    getShadowProperties(P) {
        return [MathUtils.subtractVectors(this.position, P), 1];
    }
    serialize() {
        return {
            type: "point",
            position: this.position,
            intensity: this.intensity,
            color: this.color,
        };
    }
}
