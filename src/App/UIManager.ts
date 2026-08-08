export default class UIManager {
  private timeSinceLastFrame: number = 0;
  private frameCount: number = 0;

  update(frameDelta: number) {
    this.updateFPSCounter(frameDelta);
  }

  updateFPSCounter(frameDelta: number) {
    const aSecondHasElapsed = this.timeSinceLastFrame + frameDelta >= 1000;

    if (aSecondHasElapsed) {
      console.log(`Frames per second: ${this.frameCount}`);
      this.timeSinceLastFrame = 0;
      this.frameCount = 0;
    } else {
      this.frameCount++;
      this.timeSinceLastFrame += frameDelta;
    }
  }
}
