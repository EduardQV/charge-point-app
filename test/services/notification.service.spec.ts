import { IChargePoint, IStatus } from '../../src/api/models/charge-point.model';
import { EventType } from '../../src/api/models/event.model';
import NotificationService from '../../src/api/services/notification.service';
import WebSocketServer from '../../src/websocketserver';

describe('Unit test for NotificationService', () => {
  const wssMock: WebSocketServer = jest.createMockFromModule('../../src/websocketserver');
  const service: NotificationService = new NotificationService(wssMock);

  const sendSpy = jest.fn();
  wssMock.send = jest.fn(sendSpy);

  describe('Given ChargePoint', () => {
    const chargePoint: IChargePoint = { id: 2, name: 'two', status: IStatus.READY };

    beforeEach(() => {
      sendSpy.mockClear();
    });

    describe('When receive the chargepoint', () => {
      it('Then build the notification', () => {
        service.sendChargePointStatusChange(chargePoint);

        expect(sendSpy).toHaveBeenCalledWith({
          event: EventType.ChargePointStatusChange,
          message: `Updated two status to ready`,
          data: chargePoint
        });
      });

      it('Then send the notification', () => {
        service.sendChargePointStatusChange(chargePoint);

        expect(sendSpy).toHaveBeenCalled();
      });
    });
  });
});
