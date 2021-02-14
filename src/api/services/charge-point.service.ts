import _ from 'lodash';
import { CallbackError, FilterQuery } from 'mongoose';
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
      ChargePoint.findByIdAndUpdate(id, { deleted_at: new Date() })
        .exec()
        .then((doc: IChargePointDocument | null) => {
          if (doc) {
            return resolve();
          }
          reject({ status: 404, message: `No ChargePoint found with ID: ${id}` });
        })
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }

  public findById(id: number): Promise<IChargePoint> {
    return new Promise((resolve, reject) => {
      ChargePoint.findById(id)
        .exec()
        .then((doc: IChargePointDocument | null) => {
          if (doc) {
            return resolve(doc);
          }
          reject({ status: 404, message: `No ChargePoint found with ID: ${id}` });
        })
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }

  public findAll(): Promise<Array<IChargePoint>> {
    return new Promise((resolve, reject) => {
      ChargePoint.find()
        .where('deleted_at')
        .exists(false)
        .exec()
        .then((doc: Array<IChargePointDocument>) => {
          if (doc.length > 0) {
            return resolve(doc);
          }
          reject({ status: 404, message: 'No ChargePoints found.' });
        })
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }

  public updateStatus(chargePoint: IChargePoint): Promise<void> {
    return new Promise((resolve, reject) => {
      const queryObj: FilterQuery<IChargePointDocument> = {};
      if (chargePoint.id) queryObj._id = chargePoint.id;
      if (chargePoint.name) queryObj.name = chargePoint.name;
      if (_.isEmpty(queryObj)) return reject({ status: 404, message: 'Invalid query data.' });

      ChargePoint.findOneAndUpdate(
        queryObj,
        { status: chargePoint.status },
        { omitUndefined: true }
      )
        .exec()
        .then((doc: IChargePointDocument | null) => {
          if (doc) {
            return resolve();
          }
          reject({ status: 404, message: 'No ChargePoint was found with this data.' });
        })
        .catch((err: CallbackError) => reject({ status: 500, message: err?.message }));
    });
  }
}

export default ChargePointService;
