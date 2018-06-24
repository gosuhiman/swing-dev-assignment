import {Response} from "express-serve-static-core";
import {Application} from "./application";

export class Controller {
  constructor(public app: Application) {
  }

  handleError(res: Response, err: Error) {
    res.status(500).json({
      error: err.message
    });
  }
}