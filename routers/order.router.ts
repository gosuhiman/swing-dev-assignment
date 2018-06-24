import {OrderController} from "../controllers/order.controller";
import {Router} from "../lib/router";

export class OrderRouter extends Router {
  setup() {
    const orderController: OrderController = new OrderController(this.app);

    this.route('/api/orders')
      .get(orderController.list.bind(orderController))
      .post(orderController.create.bind(orderController));
  }
}