import { Schema, Document, model } from "mongoose";
import { IPayment } from "../interface/IPayment";

export interface IPaymentDocument extends IPayment, Document {}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    metaData: { type: Map, of: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = model<IPaymentDocument>("Payment", PaymentSchema);
