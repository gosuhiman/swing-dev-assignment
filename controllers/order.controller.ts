import {Request, Response} from "express-serve-static-core";
import {from} from "rxjs";
import {Controller} from "../lib/controller";
import {CargoItem} from "../models/cargo-item";
import {OrderDocument, OrderModel} from "../models/order";
import {OrderService} from "../services/order.service";

export class OrderController extends Controller {

  create(req: Request, res: Response) {
    const cargo: CargoItem[] = req.body;
    const orderService: OrderService = <OrderService>this.app.getService(OrderService);

    orderService.create(cargo)
      .subscribe({
        next: (order: OrderDocument) => {
          console.info('New order created orderID =', order.orderID, ', trucks =', order.trucks.length, ', price =', order.price);
          res.status(201).json(order.toObject());
        },
        error: (err: Error) => {
          this.handleError(res, err);
        }
      });
  }

  list(req: Request, res: Response) {
    from(OrderModel.find().exec())
      .subscribe({
        next: (orders: OrderDocument[]) => {
          res.status(200).json(orders.map((order: OrderDocument) => {
            return order.toObject();
          }));
        },
        error: (err: Error) => {
          this.handleError(res, err);
        }
      });
  }
}