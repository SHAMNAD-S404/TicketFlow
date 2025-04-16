import { PaymentModel } from "../../models/implements/payment";
import { IPayment } from "../../models/interface/IPayment";
import { IPaymentRepo } from "../interface/IPaymentRepo";

export class PaymentRepo implements IPaymentRepo {
  constructor() {}

  async create(payment: IPayment): Promise<IPayment> {
    try {
      const createDocument = new PaymentModel(payment);
      return await createDocument.save();
    } catch (error) {
      throw error;
    }
  }

  
}
