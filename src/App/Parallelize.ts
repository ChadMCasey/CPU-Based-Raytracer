export default class Parallelize {
  // cores available for parallelization
  public availableCores: number;

  // workers
  // public workers;

  constructor() {
    this.availableCores = navigator.hardwareConcurrency;
    // this.createWorkers();
  }

  // private createWorkers(): void {
  //   for (let i = 0; i < this.availableCores; i++) {
  //     this.workers.add(new Worker());
  //   }
  // }
}
