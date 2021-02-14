import { CallbackError, Query } from 'mongoose';
import ChargePoint, { IChargePoint, IStatus } from '../../src/api/models/charge-point.model';
import ChargePointService from '../../src/api/services/charge-point.service';

describe('Unit test for ChargePointService', () => {
  const service = new ChargePointService();

  describe('Unit test for save function', () => {
    const saveSpy = jest.spyOn(ChargePoint.prototype, 'save');

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
          saveSpy.mockImplementationOnce(() => Promise.resolve(expectedChargePoint));
        });

        it('Then return the saved ChargePoint', async () => {
          const response = await service.save(chargePoint);

          expect(response).toEqual(expectedChargePoint);
        });
      });

      describe('When an error occurs', () => {
        const expectedError: CallbackError = { name: 'errorName', message: 'Error message' };

        beforeEach(() => {
          saveSpy.mockImplementationOnce(() => Promise.reject(expectedError));
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

  describe('Unit test for deleteById function', () => {
    const findByIdAndUpdateSpy = jest.spyOn(ChargePoint, 'findByIdAndUpdate');

    describe('Given id', () => {
      const reqId = 2;
      const dateMock = new Date();

      beforeEach(() => {
        spyOn(global, 'Date').and.callFake(() => {
          return dateMock;
        });
      });

      describe('When a ChargePoint is deleted', () => {
        const queryResponse: IChargePoint = {
          id: 1,
          name: 'name',
          status: IStatus.READY,
          created_at: new Date(),
          deleted_at: dateMock
        };

        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(queryResponse));
        });

        it('Then resolve promise', async () => {
          await service.deleteById(reqId);

          expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(reqId, { deleted_at: dateMock });
        });
      });

      describe('When a ChargePoint is NOT found', () => {
        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(null));
        });

        it('Then return status 404 with the error message', async () => {
          try {
            await service.deleteById(reqId);
          } catch (err) {
            expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(reqId, { deleted_at: dateMock });
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
            await service.deleteById(reqId);
          } catch (err) {
            expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(reqId, { deleted_at: dateMock });
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
            expect(err).toEqual({ status: 404, message: 'No ChargePoints found.' });
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

  describe('Unit test for updateStatus function', () => {
    const findOneAndUpdateSpy = jest.spyOn(ChargePoint, 'findOneAndUpdate');

    beforeEach(() => {
      findOneAndUpdateSpy.mockClear();
    });

    describe('Given valid ChargePoint', () => {
      const req: IChargePoint = {
        id: 2,
        name: 'name',
        status: IStatus.READY
      };

      describe('When call to db', () => {
        const queryResponse: IChargePoint = {
          id: 1,
          name: 'name',
          status: IStatus.READY
        };

        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(queryResponse));
        });

        it('Then send the query with the request data', async () => {
          await service.updateStatus(req);

          expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
            { _id: req.id, name: req.name },
            { status: req.status },
            { omitUndefined: true }
          );
        });
      });

      describe('When a ChargePoint is updated', () => {
        const queryResponse: IChargePoint = {
          id: 1,
          name: 'name',
          status: IStatus.READY
        };

        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(queryResponse));
        });

        it('Then resolve promise', async () => {
          await service.updateStatus(req);

          expect(findOneAndUpdateSpy).toHaveBeenCalled();
        });
      });

      describe('When a ChargePoint is NOT found', () => {
        beforeEach(() => {
          jest.spyOn(Query.prototype, 'exec').mockReturnValue(Promise.resolve(null));
        });

        it('Then return status 404 with the error message', async () => {
          try {
            await service.updateStatus(req);
          } catch (err) {
            expect(findOneAndUpdateSpy).toHaveBeenCalled();
            expect(err).toEqual({
              status: 404,
              message: 'No ChargePoint was found with this data.'
            });
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
            await service.updateStatus(req);
          } catch (err) {
            expect(findOneAndUpdateSpy).toHaveBeenCalled();
            expect(err).toEqual({ status: 500, message: expectedError.message });
          }
        });
      });
    });

    describe('Given ChargePoint without query information', () => {
      const req: IChargePoint = {
        status: IStatus.READY
      };

      describe('When build the query', () => {
        it('Then return the status and message error', async () => {
          try {
            await service.updateStatus(req);
          } catch (err) {
            expect(findOneAndUpdateSpy).not.toHaveBeenCalled();
            expect(err).toEqual({ status: 404, message: 'Invalid query data.' });
          }
        });
      });
    });
  });
});
