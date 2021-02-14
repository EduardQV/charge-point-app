import WebSocket from 'ws';
import { IChargePoint, IStatus } from '../../src/api/models/charge-point.model';
import NotificationService from '../../src/api/services/notification.service';
jest.mock('ws');

describe('Unit test for NotificationService', () => {
  const wssMock: WebSocket.Server = new WebSocket.Server();
  const service: NotificationService = new NotificationService(wssMock);

  describe('Given ChargePoint', () => {
    const chargePoint: IChargePoint = { id: 2, name: 'two', status: IStatus.READY };
    const sendSpy = jest.spyOn(WebSocket.prototype, 'send');

    beforeEach(() => {
      sendSpy.mockClear();
    });

    describe('When there are clients connected', () => {
      beforeEach(() => {
        const client: Set<WebSocket> = new Set();
        client.add(new WebSocket(''));
        client.add(new WebSocket(''));
        wssMock.clients = client;
      });

      it('Then send chargepoint_status_change notifications', () => {
        service.sendChargePointStatusChange(chargePoint);

        expect(sendSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe('When there are no clients connected', () => {
      beforeEach(() => {
        wssMock.clients = new Set();
      });

      it('Then NOT send chargepoint_status_change notifications', () => {
        service.sendChargePointStatusChange(chargePoint);

        expect(sendSpy).not.toHaveBeenCalled();
      });
    });
  });
});
