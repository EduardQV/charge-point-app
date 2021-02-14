import { Router, Request, Response } from 'express';
import { IChargePoint, IStatus } from '../models/charge-point.model';
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
    this.router.put('/chargepoint/status', this.putChargepointStatus);
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

  public deleteChargepoint = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'];

    try {
      await this.service.deleteById(+id);

      res.status(200).end();
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
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

  public putChargepointStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      this.validateStateChangeRequest(req);

      await this.service.updateStatus(req.body);

      res.status(200).end();
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  private validateStateChangeRequest(req: Request): void {
    if (!req.body || (!req.body.id && !req.body.name)) {
      throw { status: 400, message: 'The ID or name of the ChargePoint must be reported.' };
    }

    if (!req.body.status) {
      throw { status: 400, message: 'The status to be modified must be reported.' };
    }

    if (!Object.values(IStatus).includes(req.body.status)) {
      throw { status: 400, message: 'A valid status must be reported.' };
    }
  }
}

export default ChargePointController;
