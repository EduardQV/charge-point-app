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

    beforeEach(() => {
      mockClear();
    });

    describe('Given id', () => {
      it('Should return 200 OK', () => {
        controller.deleteChargepoint(getMockReq(), res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'OK' });
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

  describe('Unit test for putChargepoint function', () => {
    const { res, mockClear } = getMockRes();

    beforeEach(() => {
      mockClear();
    });

    describe('Given ChargePoint', () => {
      it('Should return 200 OK', () => {
        controller.putChargepoint(getMockReq(), res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'OK' });
      });
    });
  });
});
