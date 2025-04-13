import { IBaseRepo } from "./IBaseRepo";
import { IPayment } from "../../models/interface/IPayment";
import { checkoutSession , PaymentStatusUpdate } from "../../dtos/paymentDto";

export interface IPaymentRepo extends IBaseRepo<IPayment>{
    saveCheckoutSession(session : checkoutSession) : Promise<void>;
    getCheckoutSession(sessionId : string) : Promise<IPayment | null >
    updatePaymentStatus(update : PaymentStatusUpdate) : Promise<void>
    getCustomerSessions(customerId: string): Promise<IPayment[]>;
}