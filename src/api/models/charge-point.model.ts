import mongoose, { Schema, Document } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface IChargePoint {
  id?: number;
  name: string;
  status?: IStatus;
  created_at?: Date;
  deleted_at?: Date;
}

export enum IStatus {
  READY = 'ready',
  CHARGING = 'charging',
  WAITING = 'waiting',
  ERROR = 'error'
}

export interface IChargePointDocument extends Document {
  id?: number;
  name: string;
  status?: IStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

const ChargePointSchema = new Schema(
  {
    _id: Number,
    name: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: IStatus,
      default: IStatus.READY
    },
    deleted_at: Date
  },
  { _id: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

ChargePointSchema.plugin(AutoIncrement);

ChargePointSchema.set('toJSON', {
  transform: (document: IChargePointDocument, returnedObject: IChargePoint) => {
    returnedObject = {
      id: document._id,
      name: document.name,
      status: document.status,
      created_at: document.created_at,
      deleted_at: document.deleted_at
    };

    return returnedObject;
  }
});

export default mongoose.model<IChargePointDocument>('ChargePoint', ChargePointSchema);
