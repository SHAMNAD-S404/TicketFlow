import { Document } from "mongoose";


export enum PaymentStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed"
}

export interface IPayment extends Document {
    authUserUUID : string;
    companyName : string;
    companyEmail : string;
    amount : string;
    purchaseDate  : string;
    plan : string;
    planValidity : string;
    planStartDate : string;
    planEndDate : string;
    paymentStatus : PaymentStatus;
    stripeSessionId : string;
    stripePaymentIntentId ? : string;
}

