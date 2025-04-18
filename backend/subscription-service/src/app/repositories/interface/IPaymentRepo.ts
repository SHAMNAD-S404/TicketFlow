import { IPayment } from "../../models/interface/IPayment";

export interface IPaymentRepo {
  create(payment: IPayment): Promise<IPayment>;
  findOneDocument( filter : {stripeSessionId : string}) : Promise<IPayment | null>
}
