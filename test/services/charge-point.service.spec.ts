import { CallbackError } from "mongoose";
import ChargePoint, { IChargePoint, IStatus } from "../../src/api/models/charge-point.model";
import ChargePointService from "../../src/api/services/charge-point.service";

describe('Unit test for ChargePointService', () => {

    const service = new ChargePointService();
    
    describe('Unit test for saveChargePoint function', () => {

        describe('Given ChargePoint', () => {

            const chargePoint: IChargePoint = {name: "name"};

            describe('When successfully saved into the database', () => {

                const expectedChargePoint: IChargePoint = { id: 1, name: "name", status: IStatus.READY, created_at: new Date()};
                
                beforeEach(() => {
                    jest.spyOn(ChargePoint.prototype, 'save')
                        .mockImplementationOnce(() => Promise.resolve(expectedChargePoint))
                });

                it('Then return the saved ChargePoint', async() => {

                    const response = await service.saveChargePoint(chargePoint);
    
                    expect(response).toEqual(expectedChargePoint);
                });
            });

            describe('When an error occurs', () => {

                const expectedError: CallbackError = { name: "errorName", message: "Error message" };
                
                beforeEach(() => {
                    jest.spyOn(ChargePoint.prototype, 'save')
                        .mockImplementationOnce(() => Promise.reject(expectedError))
                });

                it('Then return status 500 with the error message', async() => {
                    try {
                        await service.saveChargePoint(chargePoint);
                    } catch (err) {
                        expect(err).toEqual({ status: 500, message: expectedError.message });
                    } 
                });
            });
            
        });
    });
    
});