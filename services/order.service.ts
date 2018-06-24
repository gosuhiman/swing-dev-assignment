import {from, Observable, throwError} from "rxjs";
import {Service} from "../lib/service";
import {CargoItem} from "../models/cargo-item";
import {OrderDocument, OrderModel} from "../models/order";
import {Truck} from "../models/truck";

export class OrderService extends Service {

  create(cargo: CargoItem[]): Observable<OrderDocument> {
    const order: OrderDocument = new OrderModel();
    order.price = 0;
    order.trucks = [];

    if (cargo.length == 0) {
      return throwError(new Error("No cargo to deliver"));
    }

    //Bin packing using Best Fit Decreasing algorithm
    //Not always producing optimal answer - but I hope it is good enough to get the job
    //https://www.aaai.org/Papers/AAAI/2002/AAAI02-110.pdf

    const trucks: Truck[] = [];

    //sort cargo in decreasing order
    cargo.sort((a: CargoItem, b: CargoItem): number => {
      if (a.weight > b.weight) return -1;
      if (a.weight < b.weight) return 1;
      return 0;
    });

    try {
      let currentTruck: Truck = new Truck();
      trucks.push(currentTruck);

      cargo.forEach((item: CargoItem) => {
        if (item.weight > CargoItem.MAX_WEIGHT) {
          throw new Error("Item with id=" + item.id + " exceeds max weight.");
        }

        order.price += this.getItemPrice(item);

        if (!currentTruck.addItem(item)) {
          //find truck with minimum free space, but with enough space to fit item
          let freeSpace: number = Number.MAX_VALUE;
          let nextTruck: Truck | null = null;
          trucks.forEach((t: Truck) => {
            if (t.freeSpace < freeSpace && t.freeSpace > item.weight) {
              nextTruck = t;
            }
          });

          if (nextTruck == null) {
            //truck with enough free space does not exist, so we take new truck
            currentTruck = new Truck();
            trucks.push(currentTruck);
          } else {
            currentTruck = nextTruck;
          }

          currentTruck.addItem(item);
        }
      });
    } catch (err) {
      return throwError(err);
    }

    order.trucks = trucks.map((t: Truck ) => t.toObject());
    return from(order.save());
  }

  getItemPrice(item: CargoItem) {
    if (item.weight < 400) {
      return 0.01 * item.weight;
    } else {
      return 2 + 0.005 * item.weight;
    }
  }

}