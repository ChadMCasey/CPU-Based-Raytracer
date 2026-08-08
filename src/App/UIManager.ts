export default class UIManager {
  private msSinceLastFrame: number = 0;
  private frameCount: number = 0;

  update(msFrameDelta: number) {
    this.updateFPSCounter(msFrameDelta);
  }

  updateFPSCounter(msFrameDelta: number) {
    const aSecondHasElapsed = this.msSinceLastFrame + msFrameDelta >= 1000;

    if (aSecondHasElapsed) {
      console.log(`Frames this past second: ${this.frameCount}`);
      this.msSinceLastFrame = 0;
      this.frameCount = 0;
    } else {
      this.frameCount++;
      this.msSinceLastFrame += msFrameDelta;
    }
  }
}
