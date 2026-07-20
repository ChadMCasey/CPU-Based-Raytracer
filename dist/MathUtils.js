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
    convertDegToRad(degrees) {
        return (Math.PI / 180) * degrees;
    }
    // hard coding the shit out of this, we need to fix this later
    multiplyRotationalMatrices(A, B) {
        // top row 
        const TopLeft = A[0][0] * B[0][0] + A[0][1] * B[1][0] + A[0][2] * B[2][0];
        const TopCenter = A[0][0] * B[0][1] + A[0][1] * B[1][1] + A[0][2] * B[2][1];
        const TopRight = A[0][0] * B[0][2] + A[0][1] * B[1][2] + A[0][2] * B[2][2];
        // middle row
        const MiddleLeft = A[1][0] * B[0][0] + A[1][1] * B[1][0] + A[1][2] * B[2][0];
        const MiddleCenter = A[1][0] * B[0][1] + A[1][1] * B[1][1] + A[1][2] * B[2][1];
        const MiddleRight = A[1][0] * B[0][2] + A[1][1] * B[1][2] + A[1][2] * B[2][2];
        // bottom row
        const BottomLeft = A[2][0] * B[0][0] + A[2][1] * B[1][0] + A[2][2] * B[2][0];
        const BottomCenter = A[2][0] * B[0][1] + A[2][1] * B[1][1] + A[2][2] * B[2][1];
        const BottomRight = A[2][0] * B[0][2] + A[2][1] * B[1][2] + A[2][2] * B[2][2];
        const resultingMatrix = [
            [TopLeft, TopCenter, TopRight],
            [MiddleLeft, MiddleCenter, MiddleRight],
            [BottomLeft, BottomCenter, BottomRight]
        ];
        return resultingMatrix;
    }
    multiplyDirectionByRotation(R, D) {
        const X = R[0][0] * D[0] + R[0][1] * D[1] + R[0][2] * D[2];
        const Y = R[1][0] * D[0] + R[1][1] * D[1] + R[1][2] * D[2];
        const Z = R[2][0] * D[0] + R[2][1] * D[1] + R[2][2] * D[2];
        return [X, Y, Z];
    }
    ;
    // compute pitch (x - axis) rotation matrix
    computeRx(pitchInRad) {
        return [
            [1, 0, 0],
            [0, Math.cos(pitchInRad), Math.sin(pitchInRad)],
            [0, -Math.sin(pitchInRad), Math.cos(pitchInRad)]
        ];
    }
    computeRy(yawInRad) {
        return [
            [Math.cos(yawInRad), 0, Math.sin(yawInRad)],
            [0, 1, 0],
            [-Math.sin(yawInRad), 0, Math.cos(yawInRad)]
        ];
    }
    computeRz(rollInRad) {
        return [
            [Math.cos(rollInRad), Math.sin(rollInRad), 0],
            [-Math.sin(rollInRad), Math.cos(rollInRad), 0],
            [0, 0, 1]
        ];
    }
}
