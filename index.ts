import {Application} from "./lib/application";
import {OrderRouter} from "./routers/order.router";
import {OrderService} from "./services/order.service";

const app: Application = new Application({
  dbConnectionUri: 'mongodb://localhost/swing-dev-assignment',
  port: 3000,
  services: [OrderService],
  routers: [OrderRouter]
});

app.run();