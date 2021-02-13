import express, { Application } from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import ChargePointController from './api/controllers/charge-point.controller';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.initializeMiddlewares();
    this.initializeController();
  }

  private setConfig() {
    dotenv.config({path: 'config/dev.env'});
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.urlencoded());
    this.app.use(bodyParser.json());
  }

  private initializeController(){
    this.app.use('', new ChargePointController().router);
  }

  public listen(): http.Server {
    const serverPort = process.env.APP_PORT || 5000;
    return this.app.listen(serverPort, () => console.log(`Server started in http://localhost:${serverPort}`))
  }
}

export default App;