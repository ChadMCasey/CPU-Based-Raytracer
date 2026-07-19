export default class MathUtils {
    // calculate the dot product of 2 vectors
    dotVectors(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    // subtract two vectors
    subtractVectors(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }
    // add two vectors
    addVectors(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }
    // scale vector by constant k
    scaleVector(a, k) {
        return [a[0] * k, a[1] * k, a[2] * k];
    }
    magnitude(a) {
        return Math.sqrt(this.dotVectors(a, a));
    }
    // reflect R about normal N
    reflectVector(R, N) {
        const TwoN = this.scaleVector(N, 2);
        const RDotN = this.dotVectors(R, N);
        const Scale2N = this.scaleVector(TwoN, RDotN);
        const subR = this.subtractVectors(Scale2N, R);
        return subR; // reflected vector
    }
}
