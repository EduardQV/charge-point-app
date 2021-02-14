import { CallbackError, Query } from 'mongoose';
import ChargePoint, { IChargePoint, IStatus } from '../../src/api/models/charge-point.model';
import ChargePointService from '../../src/api/services/charge-point.service';

describe('Unit test for ChargePointService', () => {
  const service = new ChargePointService();

  describe('Unit test for save function', () => {
    describe('Given ChargePoint', () => {
      const chargePoint: IChargePoint = { name: 'name' };

      describe('When successfully saved into the database', () => {
        const expectedChargePoint: IChargePoint = {
          id: 1,
          name: 'name',
          status: IStatus.READY,
          created_at: new Date()
        };

        beforeEach(() => {
          jest
            .spyOn(ChargePoint.prototype, 'save')
            .mockImplementationOnce(() => Promise.resolve(expectedChargePoint));
        });

        it('Then return the saved ChargePoint', async () => {
          const response = await service.save(chargePoint);

          expect(response).toEqual(expectedChargePoint);
        });
      });

      describe('When an error occurs', () => {
        const expectedError: CallbackError = { name: 'errorName', message: 'Error message' };

        beforeEach(() => {
          jest
            .spyOn(ChargePoint.prototype, 'save')
            .mockImplementationOnce(() => Promise.reject(expectedError));
        });

        it('Then return status 500 with the error message', async () => {
          try {
            await service.save(chargePoint);
          } catch (err) {
            expect(err).toEqual({ status: 500, message: expectedError.message });
          }
        });
      });
    });
  });

  describe('Unit test for findById function', () => {
    const findByIdSpy = jest.spyOn(ChargePoint, 'findById');

    describe('Given id', () => {
      const reqId = 2;

      describe('When a ChargePoint is found', () => {
        const expectedChargePoint: IChargePoint = {
          id: 1,
          name: 'name',
          status: IStatus.READY,
          created_at: new Date()
        };

        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(expectedChargePoint));
        });

        it('Then return the ChargePoint', async () => {
          const response = await service.findById(reqId);

          expect(findByIdSpy).toHaveBeenCalledWith(reqId);
          expect(response).toEqual(expectedChargePoint);
        });
      });

      describe('When a ChargePoint is NOT found', () => {
        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(null));
        });

        it('Then return status 404 with the error message', async () => {
          try {
            await service.findById(reqId);
          } catch (err) {
            expect(findByIdSpy).toHaveBeenCalledWith(reqId);
            expect(err).toEqual({ status: 404, message: `No ChargePoint found with ID: ${reqId}` });
          }
        });
      });

      describe('When an error occurs', () => {
        const expectedError: CallbackError = { name: 'errorName', message: 'Error message' };

        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.reject(expectedError));
        });

        it('Then return status 500 with the error message', async () => {
          try {
            await service.findById(reqId);
          } catch (err) {
            expect(findByIdSpy).toHaveBeenCalledWith(reqId);
            expect(err).toEqual({ status: 500, message: expectedError.message });
          }
        });
      });
    });
  });

  describe('Unit test for findAll function', () => {
    const findSpy = jest.spyOn(ChargePoint, 'find');

    describe('Given nothing', () => {
      describe('When ChargePoints is found', () => {
        const expectedChargePoint: Array<IChargePoint> = [
          {
            id: 1,
            name: 'name',
            status: IStatus.READY,
            created_at: new Date()
          }
        ];

        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(expectedChargePoint));
        });

        it('Then return the ChargePoints', async () => {
          const response = await service.findAll();

          expect(findSpy).toHaveBeenCalled();
          expect(response).toEqual(expectedChargePoint);
        });
      });

      describe('When ChargePoints is NOT found', () => {
        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve([]));
        });

        it('Then return status 404 with the error message', async () => {
          try {
            await service.findAll();
          } catch (err) {
            expect(findSpy).toHaveBeenCalledWith();
            expect(err).toEqual({ status: 404, message: 'No ChargePoints found' });
          }
        });
      });

      describe('When an error occurs', () => {
        const expectedError: CallbackError = { name: 'errorName', message: 'Error message' };

        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.reject(expectedError));
        });

        it('Then return status 500 with the error message', async () => {
          try {
            await service.findAll();
          } catch (err) {
            expect(findSpy).toHaveBeenCalledWith();
            expect(err).toEqual({ status: 500, message: expectedError.message });
          }
        });
      });
    });
  });
});
