import { PrismaClient } from "../../../generated/prisma";
import { IPayment } from "../../models/interface/IPayment";
import { IPaymentRepo } from "../interface/IPaymentRepo";

const prisma = new PrismaClient();

export class PaymentRepo implements IPaymentRepo {
  async create(payment: IPayment): Promise<IPayment> {
    try {
      const createdPayment = await prisma.payment.create({
        data: payment,
      });
      return createdPayment;
    } catch (error) {
      throw error;
    }
  }
  

  async findOneDocument(filter: { stripeSessionId: string }): Promise<IPayment | null> {
    try {
      return await prisma.payment.findFirst({
        where: {
          stripeSessionId: filter.stripeSessionId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
