import { SerializedPayload, Task } from "../Utility/types";

export default class Parallelize {
  // cores available for parallelization
  private availableCores: number = navigator.hardwareConcurrency;

  private workers: Worker[] = new Array<Worker>();

  private serializedScene?: SerializedPayload;
  private sharedArrayBuffer?: Uint8ClampedArray;

  private updateScreenCallback: Function = () => {};

  private tasks: Task[] = new Array<Task>();
  public outstandingTasks: number = 0;

  private onRenderComplete?: () => void;

  constructor() {
    this.createWorkers();
  }

  private createWorkers(): void {
    for (let i = 0; i < this.availableCores; i++) {
      const worker = new Worker(new URL("./Worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (event: MessageEvent) => this.handleWorkerResponse(worker);
      this.workers.push(worker);
    }
  }

  private handleWorkerResponse(worker: Worker): void {
    // decrement the remaining tasks
    this.outstandingTasks--;

    // we have more work to do, provide the given worker a new tasks off the queue
    if (this.tasks.length) {
      const openTask = this.tasks.pop();
      const serializedScene = this.serializedScene;
      const sharedArrayBuffer = this.sharedArrayBuffer;
      worker.postMessage({ serializedScene, sharedArrayBuffer, openTask });
      return;
    }

    // if we have no remaining tasks then we can update the screen
    if (!this.outstandingTasks) {
      this.updateScreenCallback();
      if (this.onRenderComplete) this.onRenderComplete();
    }
  }

  private createTasks(Ch: number, Cw: number, Vw: number, Vh: number, bands: number): Task[] {
    // clear existing tasks
    this.tasks = [];

    const bandHeight: number = Ch / bands;
    const bandWidth: number = Cw;

    for (let i = 0; i < bands; i++) {
      const startY = bandHeight * i;
      const startX = 0;
      this.tasks.push({
        startX: startX,
        startY: startY,
        width: bandWidth,
        height: bandHeight,
        targetWidth: Cw,
        targetHeight: Ch,
        viewportWidth: Vw,
        viewportHeight: Vh,
      });
    }

    this.outstandingTasks = this.tasks.length;

    return this.tasks;
  }

  public async renderFrame(
    Cw: number,
    Ch: number,
    Vw: number,
    Vh: number,
    bands: number,
    serializedScene: SerializedPayload,
    sharedArrayBuffer: Uint8ClampedArray,
    updateScreenCallback: Function,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.createTasks(Cw, Ch, Vw, Vh, bands);
      this.serializedScene = serializedScene;
      this.sharedArrayBuffer = sharedArrayBuffer;
      this.updateScreenCallback = updateScreenCallback;

      this.onRenderComplete = resolve;

      // iterate our workers and give them an initial task
      for (let worker of this.workers) {
        const openTask = this.tasks.pop();
        if (openTask) {
          const serializedScene = this.serializedScene;
          const sharedArrayBuffer = this.sharedArrayBuffer;
          worker.postMessage({ serializedScene, sharedArrayBuffer, openTask });
        }
      }
    });
  }
}
