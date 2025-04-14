import mongoose, { Document, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "../interface/IPayment";

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    authUserUUID: { type: String, required: true },
    companyName : { type: String, required: true },
    companyEmail: { type: String, required: true },
    amount: { type: String, required: true },
    purchaseDate: { type: String, required: true },
    plan: { type: String, required: true },
    planValidity: { type: String, required: true },
    planStartDate: { type: String, required: true },
    planEndDate: { type: String, required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, required: true },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payments", PaymentSchema);
