import uniqid from "uniqid";
import {CargoItem} from "./cargo-item";

export class Truck {
  truckID: string;
  load: CargoItem[] = [];
  loadWeight: number = 0;

  constructor() {
    this.truckID = uniqid();
  }

  get freeSpace(): number {
    return Truck.MAX_LOAD_WEIGHT - this.loadWeight;
  }

  addItem(item: CargoItem): boolean {
    if (this.loadWeight + item.weight > Truck.MAX_LOAD_WEIGHT) return false;
    this.load.push(item);
    this.loadWeight += item.weight;
    return true;
  }

  toObject(): any {
    return {
      truckID: this.truckID,
      load: this.load
    };
  }
}

export namespace Truck {
  export const MAX_LOAD_WEIGHT: number = 1000;
}