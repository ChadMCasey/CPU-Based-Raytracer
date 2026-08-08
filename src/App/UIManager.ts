export default class UIManager {
  private readonly fpsCounter: HTMLElement = document.querySelector(".fps") as HTMLElement;

  // the running total of MS & frames over the course of a second
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

    // a second has elapsed
    if (this.accumulateMs >= 1000) {
      this.fpsCounter.textContent = `FPS: ${this.frameCount}`;

      // if we overshot the current second, we need to add that time onto the next one
      this.accumulateMs -= 1000;

      // reset the frame count
      this.frameCount = 0;
    }
  }
}
