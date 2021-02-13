import * as express from 'express';
import { IChargePoint } from '../models/charge-point.model';
import ChargePointService from '../services/charge-point.service';

class ChargePointController {

  public router = express.Router();
  public service = new ChargePointService();

  constructor(){
    this.initializeRutes();
  }

  private initializeRutes(){
    this.router.post('/chargepoint', this.postChargepoint);
    this.router.delete('/chargepoint/:id', this.deleteChargepoint);
    this.router.get('/chargepoint', this.getChargepoint);
    this.router.get('/chargepoint/:id', this.getChargepoint);
    this.router.put('/chargepoint/status', this.putChargepoint);
  }

  public postChargepoint = async(req: express.Request, res: express.Response): Promise<void> => {
    try {

      const createdItem: IChargePoint = await this.service.saveChargePoint(req.body);
     
      res.status(201).json(createdItem);

    } catch(err) {
      const status = err.status? err.status : 500;
      res.status(status).json(err)
    }
  }

  public deleteChargepoint = (req: express.Request, res: express.Response): void => {
    res.status(200).json({message: "OK"});
  }

  public getChargepoint = (req: express.Request, res: express.Response): void => {
    res.status(200).json({message: "OK"});
  }

  public putChargepoint = (req: express.Request, res: express.Response): void => {
    res.status(200).json({message: "OK"});
  }
}
  
export default ChargePointController;