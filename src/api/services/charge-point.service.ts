import { DeleteWriteOpResultObject } from 'mongodb';
import { CallbackError } from 'mongoose';
import ChargePoint, { IChargePoint, IChargePointDocument } from '../models/charge-point.model';

class ChargePointService {
  public save(chargePoint: IChargePoint): Promise<IChargePoint> {
    return new Promise((resolve, reject) => {
      new ChargePoint(chargePoint)
        .save()
        .then((doc: IChargePointDocument) => resolve(doc))
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }

  public deleteById(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      ChargePoint.deleteOne({ _id: id })
        .exec()
        .then((res: DeleteWriteOpResultObject) =>
          res.deletedCount === 1
            ? resolve()
            : reject({ status: 404, message: `No ChargePoint found with ID: ${id}` })
        )
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }

  public findById(id: number): Promise<IChargePoint> {
    return new Promise((resolve, reject) => {
      ChargePoint.findById(id)
        .exec()
        .then((doc: IChargePointDocument | null) => {
          if (doc) {
            resolve(doc);
          }
          reject({ status: 404, message: `No ChargePoint found with ID: ${id}` });
        })
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }

  public findAll(): Promise<Array<IChargePoint>> {
    return new Promise((resolve, reject) => {
      ChargePoint.find()
        .exec()
        .then((doc: Array<IChargePointDocument>) => {
          if (doc.length > 0) {
            resolve(doc);
          }
          reject({ status: 404, message: `No ChargePoints found` });
        })
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }
}

export default ChargePointService;
