import { getMockReq, getMockRes } from '@jest-mock/express';
import ChargePointController from '../../src/api/controllers/charge-point.controller';
import { IChargePoint } from '../../src/api/models/charge-point.model';
import ChargePointService from '../../src/api/services/charge-point.service';

describe('Unit test for ChargePointController', () => {
  const controller = new ChargePointController();

  describe('Unit test for postChargepoint function', () => {
    const { res, mockClear } = getMockRes();
    const saveSpy = jest.spyOn(ChargePointService.prototype, 'save');

    beforeEach(() => {
      mockClear();
    });

    describe('Given ChargePoint', () => {
      const chargePoint: IChargePoint = { name: 'name' };
      const req = getMockReq({ body: chargePoint });

      describe('When the operation has worked correctly', () => {
        beforeEach(() => {
          saveSpy.mockImplementationOnce(() => Promise.resolve(chargePoint));
        });

        it('Then return status 201 and saved ChargePoint', async () => {
          await controller.postChargepoint(req, res);

          expect(saveSpy).toHaveBeenCalledWith(chargePoint);
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.json).toHaveBeenCalledWith(chargePoint);
        });
      });

      describe('When an error occurs', () => {
        const serverError = { status: 500, message: 'Error message' };

        beforeEach(() => {
          saveSpy.mockImplementationOnce(() => Promise.reject(serverError));
        });

        it('Then return the status and message error', async () => {
          await controller.postChargepoint(req, res);

          expect(saveSpy).toHaveBeenCalledWith(chargePoint);
          expect(res.status).toHaveBeenCalledWith(serverError.status);
          expect(res.json).toHaveBeenCalledWith(serverError);
        });
      });
    });
  });

  describe('Unit test for deleteChargepoint function', () => {
    const { res, mockClear } = getMockRes();
    const deleteByIdSpy = jest.spyOn(ChargePointService.prototype, 'deleteById');

    beforeEach(() => {
      mockClear();
    });

    describe('Given id', () => {
      const reqId = 2;
      const req = getMockReq({ params: { id: reqId } });

      describe('When ChargePoint is deleted', () => {
        beforeEach(() => {
          deleteByIdSpy.mockImplementationOnce(() => Promise.resolve());
        });

        it('Then return OK response', async () => {
          await controller.deleteChargepoint(req, res);

          expect(deleteByIdSpy).toHaveBeenCalledWith(reqId);
          expect(res.status).toHaveBeenCalledWith(200);
        });
      });

      describe('When an error occurs', () => {
        const serverError = { status: 404, message: 'Error message' };

        beforeEach(() => {
          deleteByIdSpy.mockImplementationOnce(() => Promise.reject(serverError));
        });

        it('Then return the status and message error', async () => {
          await controller.deleteChargepoint(req, res);

          expect(deleteByIdSpy).toHaveBeenCalledWith(reqId);
          expect(res.status).toHaveBeenCalledWith(serverError.status);
          expect(res.json).toHaveBeenCalledWith(serverError);
        });
      });
    });
  });

  describe('Unit test for getChargepoint function', () => {
    const { res, mockClear } = getMockRes();
    const findAllSpy = jest.spyOn(ChargePointService.prototype, 'findAll');

    beforeEach(() => {
      mockClear();
    });

    describe('Given nothing', () => {
      const req = getMockReq();

      describe('When found ChargePoints', () => {
        const chargePoints: Array<IChargePoint> = [
          { id: 1, name: 'one' },
          { id: 2, name: 'two' }
        ];

        beforeEach(() => {
          findAllSpy.mockImplementationOnce(() => Promise.resolve(chargePoints));
        });

        it('Then returns status 200 and found ChargePoints', async () => {
          await controller.getChargepoint(req, res);

          expect(findAllSpy).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(chargePoints);
        });
      });

      describe('When not found ChargePoints', () => {
        const serverError = { status: 404, message: 'Error message' };

        beforeEach(() => {
          findAllSpy.mockImplementationOnce(() => Promise.reject(serverError));
        });

        it('Then return the status and message error', async () => {
          await controller.getChargepoint(req, res);

          expect(findAllSpy).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(serverError.status);
          expect(res.json).toHaveBeenCalledWith(serverError);
        });
      });
    });
  });

  describe('Unit test for getChargepointtById function', () => {
    const { res, mockClear } = getMockRes();
    const findByIdSpy = jest.spyOn(ChargePointService.prototype, 'findById');

    beforeEach(() => {
      mockClear();
    });

    describe('Given id', () => {
      const reqId = 2;
      const req = getMockReq({ params: { id: reqId } });

      describe('When found ChargePoint', () => {
        const chargePoint: IChargePoint = { id: reqId, name: 'two' };

        beforeEach(() => {
          findByIdSpy.mockImplementationOnce(() => Promise.resolve(chargePoint));
        });

        it('Then returns status 200 and found ChargePoint', async () => {
          await controller.getChargepointById(req, res);

          expect(findByIdSpy).toHaveBeenCalledWith(reqId);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(chargePoint);
        });
      });

      describe('When not found ChargePoint', () => {
        const serverError = { status: 404, message: 'Error message' };

        beforeEach(() => {
          findByIdSpy.mockImplementationOnce(() => Promise.reject(serverError));
        });

        it('Then return the status and message error', async () => {
          await controller.getChargepointById(req, res);

          expect(findByIdSpy).toHaveBeenCalledWith(reqId);
          expect(res.status).toHaveBeenCalledWith(serverError.status);
          expect(res.json).toHaveBeenCalledWith(serverError);
        });
      });
    });
  });

  describe('Unit test for putChargepointStatus function', () => {
    const { res, mockClear } = getMockRes();
    const updateStatusSpy = jest.spyOn(ChargePointService.prototype, 'updateStatus');

    beforeEach(() => {
      mockClear();
    });

    describe('Given request without body', () => {
      const req = getMockReq();

      describe('When the request is validated', () => {
        it('Then return the status and message error', async () => {
          await controller.putChargepointStatus(req, res);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            status: 400,
            message: 'The ID or name of the ChargePoint must be reported.'
          });
        });
      });
    });

    describe('Given ChargePoint without ID or name', () => {
      const req = getMockReq({ body: { status: 'ready' } });

      describe('When the request is validated', () => {
        it('Then return the status and message error', async () => {
          await controller.putChargepointStatus(req, res);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            status: 400,
            message: 'The ID or name of the ChargePoint must be reported.'
          });
        });
      });
    });

    describe('Given ChargePoint without state', () => {
      const req = getMockReq({ body: { id: 2, name: 'name' } });

      describe('When the request is validated', () => {
        it('Then return the status and message error', async () => {
          await controller.putChargepointStatus(req, res);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            status: 400,
            message: 'The status to be modified must be reported.'
          });
        });
      });
    });

    describe('Given ChargePoint with invalid state', () => {
      const req = getMockReq({ body: { id: 2, name: 'name', status: 'invalid' } });

      describe('When the request is validated', () => {
        it('Then return the status and message error', async () => {
          await controller.putChargepointStatus(req, res);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            status: 400,
            message: 'A valid status must be reported.'
          });
        });
      });
    });

    describe('Given valid ChargePoint', () => {
      const req = getMockReq({ body: { id: 2, name: 'name', status: 'ready' } });

      describe('When the ChargePoint is modified', () => {
        beforeEach(() => {
          updateStatusSpy.mockImplementation(() => Promise.resolve());
        });

        it('Then return OK response', async () => {
          await controller.putChargepointStatus(req, res);

          expect(updateStatusSpy).toHaveBeenCalledWith(req.body);
          expect(res.status).toHaveBeenCalledWith(200);
        });
      });

      describe('When an error occurs', () => {
        const serverError = { status: 404, message: 'Error message' };

        beforeEach(() => {
          updateStatusSpy.mockImplementation(() => Promise.reject(serverError));
        });

        it('Then return the status and message error', async () => {
          await controller.putChargepointStatus(req, res);

          expect(updateStatusSpy).toHaveBeenCalledWith(req.body);
          expect(res.status).toHaveBeenCalledWith(serverError.status);
          expect(res.json).toHaveBeenCalledWith(serverError);
        });
      });
    });
  });
});
