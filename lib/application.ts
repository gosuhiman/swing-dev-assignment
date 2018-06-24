import bodyParser from "body-parser";
import express from "express";
import core from "express-serve-static-core";
import {NextFunction, Request, Response} from "express-serve-static-core";
import mongoose from 'mongoose';
import {from, Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {ApplicationConfig} from "./application-config";
import {Service} from "./service";

export class Application {
  express: core.Express;
  services: Map<Function, Service> = new Map<Function, Service>();

  constructor(public config: ApplicationConfig) {
    this.express = express();
  }

  run() {
    this.setup()
      .subscribe({
        next: () => {
          this.express.listen(this.config.port);
          console.info('HTTP server running');

        },
        error: (err: Error) => {
          console.error(err.stack);
        },
      });
  }

  getService(serviceClass: Function): Service {
    const service: Service | undefined = this.services.get(serviceClass);
    if (!service) {
      throw new Error("Service does not exist");
    }
    return service;
  }

  setup(): Observable<null> {
    this.express.use(bodyParser.json());
    this.express.use(express.static('public'));

    return this.setupDatabase()
      .pipe(tap(() => {
        this.setupServices();
        this.setupRouters();
        this.setupErrorHandlers();
      }));
  }

  setupDatabase(): Observable<any> {
    console.info('Connecting to database ' + this.config.dbConnectionUri);

    return from(mongoose.connect(this.config.dbConnectionUri))
      .pipe(tap(() => {
        console.info('Connected to database');
      }));
  }

  setupServices() {
    console.info('Setting up services');

    this.config.services.forEach((serviceClass: any) => {
      this.services.set(serviceClass, new serviceClass(this));
    });
  }

  setupRouters() {
    console.info('Setting up routers');

    this.config.routers.forEach((routerClass: any) => {
      this.express.use('/', new routerClass(this).router);
    });
  }

  setupErrorHandlers() {
    console.info('Setting up error handlers');

    this.express.all('*', (req: Request, res: Response, next: NextFunction) => {
      console.error("404 - " + req.originalUrl);
      res.status(404).send({error: "404 - Not found"});
    });

    this.express.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).send({error: "500 - Internal server error."});
    });
  }
}