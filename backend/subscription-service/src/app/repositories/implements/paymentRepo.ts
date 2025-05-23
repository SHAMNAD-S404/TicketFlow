import { PrismaClient } from "@prisma/client";
import { IPaymentResponseDTO } from "../../dtos/paymentHistory.dto";
import { IPayment } from "../../models/interface/IPayment";
import { IPaymentRepo } from "../interface/IPaymentRepo";

const prisma = new PrismaClient();

/**
 * @class PaymentRepo
 * @description Manages data access operations for the Payment entity.
 * This class provides a concrete implementation for interacting with the payment collection in the database.
 * @implements {IPaymentRepo}
 */

export class PaymentRepo implements IPaymentRepo {

//========================= CREATE DOCUMENT ==========================================================

  async create(payment: IPayment): Promise<IPayment> {
    
      const createdPayment = await prisma.payment.create({
        data: payment,
      });
      return createdPayment;
  }

//========================= FIND ONE DOCUMENT =========================================================

  async findOneDocument(filter: { stripeSessionId: string }): Promise<IPayment | null> {
    
      return await prisma.payment.findFirst({
        where: {
          stripeSessionId: filter.stripeSessionId,
        },
      });
  }

//========================= GET ALL PAYMENTS BY UUID ====================================================

  async getAllPaymentsByAuthUUID(authUserUUID: string): Promise<IPaymentResponseDTO[] | null> {

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
  }

//========================= GET TOTOAL REVANUE ==========================================================
 
  async getTotalRevanue(): Promise<number> {

      const result = await prisma.$queryRaw<
        Array<{ total: string | null }>
      >`SELECT SUM(CAST(amount AS FLOAT)) as total FROM "Payment"`;

      return parseFloat(result[0]?.total ?? "0");
  }

//========================= TOTAL ORDERS COUNT =========================================================
 
  async getTotalOrdersCount(): Promise<number> {   
      return await prisma.payment.count();
  }

//========================= INTERFACE FOR CHAT CONTROLLER ===============================================

}
