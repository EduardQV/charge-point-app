import { Router, Request, Response } from 'express';
import { IChargePoint } from '../models/charge-point.model';
import ChargePointService from '../services/charge-point.service';

class ChargePointController {
  public router = Router();
  private service = new ChargePointService();

  constructor() {
    this.initializeRutes();
  }

  private initializeRutes() {
    this.router.post('/chargepoint', this.postChargepoint);
    this.router.delete('/chargepoint/:id', this.deleteChargepoint);
    this.router.get('/chargepoint', this.getChargepoint);
    this.router.get('/chargepoint/:id', this.getChargepointById);
    this.router.put('/chargepoint/status', this.putChargepoint);
  }

  public postChargepoint = async (req: Request, res: Response): Promise<void> => {
    try {
      const createdItem: IChargePoint = await this.service.save(req.body);

      res.status(201).json(createdItem);
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  public deleteChargepoint = (req: Request, res: Response): void => {
    res.status(200).json({ message: 'OK' });
  };

  public getChargepoint = async (req: Request, res: Response): Promise<void> => {
    try {
      const chargePoints: Array<IChargePoint> = await this.service.findAll();

      res.status(200).json(chargePoints);
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  public getChargepointById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'];

    try {
      const chargePoint: IChargePoint = await this.service.findById(+id);

      res.status(200).json(chargePoint);
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  public putChargepoint = (req: Request, res: Response): void => {
    res.status(200).json({ message: 'OK' });
  };
}

export default ChargePointController;
