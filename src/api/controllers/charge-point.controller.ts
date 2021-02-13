import * as express from 'express';

class ChargePointController {

  public router = express.Router();

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

  public postChargepoint = (req: express.Request, res: express.Response) => {
    res.status(200).json({message: "OK"});
  }

  public deleteChargepoint = (req: express.Request, res: express.Response) => {
    res.status(200).json({message: "OK"});
  }

  public getChargepoint = (req: express.Request, res: express.Response) => {
    res.status(200).json({message: "OK"});
  }

  public putChargepoint = (req: express.Request, res: express.Response) => {
    res.status(200).json({message: "OK"});
  }
}
  
export default ChargePointController;