import express, { Application } from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import ChargePointController from './api/controllers/charge-point.controller';
import mongoose, { ConnectionOptions } from 'mongoose';
import WebSocketServer from './websocketserver';

class App {
  public app: Application;
  private webSocketServer: WebSocketServer;

  constructor() {
    this.setConfig();
    this.app = express();
    const httpServer: http.Server = this.startHttpServer();
    this.webSocketServer = new WebSocketServer(httpServer);
    this.connectToMongodb();
    this.initializeMiddlewares();
    this.initializeController();
  }

  private startHttpServer(): http.Server {
    const serverPort = process.env.APP_PORT || 5000;
    return this.app.listen(serverPort, () =>
      console.log(`Server started in http://localhost:${serverPort}`)
    );
  }

  private setConfig(): void {
    dotenv.config({ path: 'config/dev.env' });
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.urlencoded());
    this.app.use(bodyParser.json());
  }

  private initializeController(): void {
    this.app.use('', new ChargePointController(this.webSocketServer).router);
  }

  private connectToMongodb(): void {
    const url: string = process.env.MONGODB_URL || 'localhost:27017/wenea';
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    };

    mongoose
      .connect(`mongodb://${url}`, options)
      .then(() => console.log(`Connection to ${url} has been established`))
      .catch((err) => console.log(err));
  }
}

export default App;
