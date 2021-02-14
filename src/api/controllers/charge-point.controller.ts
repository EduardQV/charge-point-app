import { Router, Request, Response } from 'express';
import WebSocket from 'ws';
import ChargePointService from '../services/charge-point.service';
import NotificationService from '../services/notification.service';
import { IChargePoint, IStatus } from '../models/charge-point.model';

class ChargePointController {
  private _router: Router;
  private chargePointService: ChargePointService;
  private notificationService: NotificationService;

  constructor(wss: WebSocket.Server) {
    this._router = Router();
    this.notificationService = new NotificationService(wss);
    this.chargePointService = new ChargePointService();
    this.initializeRutes();
  }

  get router(): Router {
    return this._router;
  }

  private initializeRutes() {
    this._router.post('/chargepoint', this.postChargepoint);
    this._router.delete('/chargepoint/:id', this.deleteChargepoint);
    this._router.get('/chargepoint', this.getChargepoint);
    this._router.get('/chargepoint/:id', this.getChargepointById);
    this._router.put('/chargepoint/status', this.putChargepointStatus);
  }

  public postChargepoint = async (req: Request, res: Response): Promise<void> => {
    try {
      const createdItem: IChargePoint = await this.chargePointService.save(req.body);

      res.status(201).json(createdItem);
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  public deleteChargepoint = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'];

    try {
      await this.chargePointService.deleteById(+id);

      res.status(200).end();
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  public getChargepoint = async (req: Request, res: Response): Promise<void> => {
    try {
      const chargePoints: Array<IChargePoint> = await this.chargePointService.findAll();

      res.status(200).json(chargePoints);
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  public getChargepointById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'];

    try {
      const chargePoint: IChargePoint = await this.chargePointService.findById(+id);

      res.status(200).json(chargePoint);
    } catch (err) {
      const status = err.status ? err.status : 500;
      res.status(status).json(err);
    }
  };

  public putChargepointStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      this.validateStateChangeRequest(req);

      const updatedChargepoint = await this.chargePointService.updateStatus(req.body);

      this.notificationService.sendChargePointStatusChange(updatedChargepoint);
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
