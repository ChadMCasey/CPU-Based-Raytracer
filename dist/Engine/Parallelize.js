export default class Parallelize {
    constructor() {
        // cores available for parallelization
        this.availableCores = navigator.hardwareConcurrency;
        this.workers = new Array();
        this.updateScreenCallback = () => { };
        this.tasks = new Array();
        this.outstandingTasks = 0;
        this.createWorkers();
    }
    createWorkers() {
        for (let i = 0; i < this.availableCores; i++) {
            const worker = new Worker(new URL("./Worker.ts", import.meta.url), { type: "module" });
            worker.onmessage = (event) => this.handleWorkerResponse(worker);
            this.workers.push(worker);
        }
    }
    handleWorkerResponse(worker) {
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
        if (!this.outstandingTasks)
            this.updateScreenCallback();
    }
    createTasks(Ch, Cw, Vw, Vh, bands) {
        // clear existing tasks
        this.tasks = [];
        const bandHeight = Ch / bands;
        const bandWidth = Cw;
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
    renderFrame(Cw, Ch, Vw, Vh, bands, serializedScene, sharedArrayBuffer, updateScreenCallback) {
        // partition the canvas into sections / tasks
        this.createTasks(Cw, Ch, Vw, Vh, bands);
        // add ref to serialized scene and array buffer for the worker response
        this.serializedScene = serializedScene;
        this.sharedArrayBuffer = sharedArrayBuffer;
        // callback that should fire when all tasks are finished
        // the parallelize class houses the logic to determine when this
        // operation should be executed
        this.updateScreenCallback = updateScreenCallback;
        // iterate our workers and give them an initial task
        for (let worker of this.workers) {
            const openTask = this.tasks.pop();
            if (openTask) {
                const serializedScene = this.serializedScene;
                const sharedArrayBuffer = this.sharedArrayBuffer;
                worker.postMessage({ serializedScene, sharedArrayBuffer, openTask });
            }
        }
    }
}
