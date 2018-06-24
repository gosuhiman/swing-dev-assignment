import {Document, Model as MongooseModel, model, Schema} from "mongoose";
import {Truck} from "./truck";

export interface OrderDocument extends Document {
  orderID: string;
  price: number;
  trucks: Truck[];
}

const schema: Schema = new Schema({
  price: Number,
  trucks: [{
    truckID: String,
    load: [{
      id: String,
      weight: Number
    }]
  }],
  created: {
    type: Date,
    default: Date.now
  },
}, {
  toObject: {
    versionKey: false,
    virtuals: true,
    transform: function (doc, ret) {
      if (ret.trucks) {
        ret.trucks.forEach((truck: any) => {
          delete truck._id;
          if (truck.load) {
            truck.load.forEach((item: any) => {
              delete item._id;
            });
          }
        });
      }
      delete ret._id;
      delete ret.id;
    }
  }
});

schema.virtual('orderID').get(function (this: OrderDocument) {
  return this._id;
});

export const OrderModel: MongooseModel<OrderDocument> = model<OrderDocument>('Order', schema);