import express, { Application } from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import ChargePointController from './api/controllers/charge-point.controller';
import mongoose, { ConnectionOptions } from 'mongoose';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.connectToMongodb();
    this.initializeMiddlewares();
    this.initializeController();
  }

  public listen(): http.Server {
    const serverPort = process.env.APP_PORT || 5000;
    return this.app.listen(serverPort, () => console.log(`Server started in http://localhost:${serverPort}`))
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

  public async connectToMongodb(){
    const url: string = process.env.MONGODB_URL || 'localhost:27017/wenea';
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    mongoose.connect(`mongodb://${url}`, options)
      .then(() => console.log(`Connection to ${url} has been established`))
      .catch(err => console.log(err));  
  }
}

export default App;