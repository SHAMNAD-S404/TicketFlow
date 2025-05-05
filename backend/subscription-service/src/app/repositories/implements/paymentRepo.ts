import { PrismaClient } from "@prisma/client";
import { IPaymentResponseDTO } from "../../dtos/paymentHistory.dto";
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

  // to get all payment details based on the authUserUUID Field
  async getAllPaymentsByAuthUUID(authUserUUID: string): Promise<IPaymentResponseDTO[] | null> {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          authUserUUID,
        },
        select: {
          purchaseDate: true,
          plan: true,
          amount: true,
          stripeSessionId: true,
        },
        orderBy: {
          purchaseDate: "desc",
        },
        take: 7,
      });
      return payments;
    } catch (error) {
      throw error;
    }
  }

  //to get the total revanue
  async getTotalRevanue(): Promise<number> {
    try {
      const result = await prisma.$queryRaw<
        Array<{ total: string | null }>
      >`SELECT SUM(CAST(amount AS FLOAT)) as total FROM "Payment"`;

      return parseFloat(result[0]?.total ?? "0");
    } catch (error) {
      throw error;
    }
  }

  //to get total rows count
  async getTotalOrdersCount(): Promise<number> {
    try {
      return await prisma.payment.count();
    } catch (error) {
      throw error;
    }
  }
}
