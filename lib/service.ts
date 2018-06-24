import {Application} from "./application";

export class Service {
  constructor(public app: Application) {
    this.setup();
  }

  setup() {
  }
}