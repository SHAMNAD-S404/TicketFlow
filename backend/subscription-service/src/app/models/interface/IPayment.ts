import { paymentStatus } from "../../../generated/prisma";

export interface IPayment {
  authUserUUID: string;
  companyName: string;
  companyEmail: string;
  amount: string;
  purchaseDate: string;
  plan: string;
  planValidity: string;
  planStartDate: string;
  planEndDate: string;
  paymentStatus: paymentStatus;
  stripeSessionId: string;
  stripePaymentIntentId : string ;
}
