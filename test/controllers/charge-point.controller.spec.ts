import { getMockReq, getMockRes } from '@jest-mock/express';
import ChargePointController from "../../src/api/controllers/charge-point.controller";
import { IChargePoint } from '../../src/api/models/charge-point.model';
import ChargePointService from '../../src/api/services/charge-point.service';

describe('Unit test for ChargePointController', () => {

    const controller = new ChargePointController();
    
    describe('Unit test for postChargepoint function', () => {

        const { res, mockClear } = getMockRes()

        beforeEach(() => {
            mockClear();
        });

        describe('Given ChargePoint', () => {

            const chargePoint: IChargePoint = { name: "name" };
            const req = getMockReq( { body: chargePoint } );
            
            describe('When the operation has worked correctly', () => {
                
                beforeEach(() => {
                    jest.spyOn(ChargePointService.prototype, 'saveChargePoint')
                        .mockImplementationOnce(() => Promise.resolve(chargePoint))
                });
                
                it('Then return status 201 and saved ChargePoint', async() => {
                    await controller.postChargepoint(req, res);
    
                    expect(controller.service.saveChargePoint).toHaveBeenCalledWith(chargePoint);
                    expect(res.status).toHaveBeenCalledWith(201);
                    expect(res.json).toHaveBeenCalledWith(chargePoint);
                });
            });

            describe('When an error occurs', () => {

                const serverError  = { status: 500, message: "Error message" };

                beforeEach(() => {
                    jest.spyOn(ChargePointService.prototype, 'saveChargePoint')
                        .mockImplementationOnce(() => Promise.reject(serverError))
                });
                
                it('Then return the status and message error ', async() => {
                    await controller.postChargepoint(req, res);
    
                    expect(controller.service.saveChargePoint).toHaveBeenCalledWith(chargePoint);
                    expect(res.status).toHaveBeenCalledWith(serverError.status);
                    expect(res.json).toHaveBeenCalledWith(serverError);
                });
            });
            
        });
    });

    describe('Unit test for deleteChargepoint function', () => {

        const { res, mockClear } = getMockRes()

        beforeEach(() => {
            mockClear();
        });

        describe('Given id', () => {

            it('Should return 200 OK', () => {
                controller.deleteChargepoint(getMockReq(), res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({message: "OK"});
            });
        });
    });

    describe('Unit test for getChargepoint function', () => {

        const { res, mockClear } = getMockRes()

        beforeEach(() => {
            mockClear();
        });

        describe('Given id', () => {

            it('Should return 200 OK', () => {
                controller.getChargepoint(getMockReq(), res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({message: "OK"});
            });
        });
    });

    describe('Unit test for putChargepoint function', () => {

        const { res, mockClear } = getMockRes()

        beforeEach(() => {
            mockClear();
        });

        describe('Given ChargePoint', () => {

            it('Should return 200 OK', () => {
                controller.getChargepoint(getMockReq(), res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({message: "OK"});
            });
        });
    });
    
});
