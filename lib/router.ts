import express from "express";
import {IRoute} from "express";
import {PathParams} from "express-serve-static-core";
import {Application} from "./application";

export class Router {
  private router: express.Router;

  constructor(public app: Application) {
    this.router = express.Router();
    this.setup();
  }

  setup() {

  }

  route(prefix: PathParams): IRoute {
    return this.router.route(prefix);
  }
}