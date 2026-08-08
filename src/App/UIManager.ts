export default class UIManager {
  private accumulateMs: number = 0;
  private frameCount: number = 0;

  update(msFrameDelta: number) {
    this.updateFPSCounter(msFrameDelta);
  }

  updateFPSCounter(msFrameDelta: number) {
    // increment the frame
    this.frameCount++;

    // accumulate the ms since the last frame
    this.accumulateMs += msFrameDelta;

    // a second has elapsed since the last FPS render
    if (this.accumulateMs >= 1000) {
      console.log(`Frames in the last second: ${this.frameCount}`);

      // we keep the ms that exceed 1000 in our accumulator
      this.accumulateMs -= 1000;

      // reset the frame count
      this.frameCount = 0;
    }
  }
}
