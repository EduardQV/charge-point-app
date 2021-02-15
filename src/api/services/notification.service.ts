import WebSocketServer from '../../websocketserver';
import { IChargePoint } from '../models/charge-point.model';
import { EventType } from '../models/event.model';
import { Notification } from '../models/notification.model';

class NotificationService {
  private webSocketServer: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.webSocketServer = wss;
  }

  public sendChargePointStatusChange(chargePoint: IChargePoint): void {
    const notification: Notification = {
      event: EventType.ChargePointStatusChange,
      message: `Updated ${chargePoint.name} status to ${chargePoint.status}`,
      data: chargePoint
    };

    this.webSocketServer.send(notification);
  }
}

export default NotificationService;
