// src/app/repositories/implementation/paymentRepo.ts
import { IPaymentRepo } from "../interface/IPaymentRepo";
import { BaseRepository } from "./baseRepository";
import { Payment, IPaymentDocument } from "../../models/implements/payment";
import { IPayment } from "../../models/interface/IPayment";
import { checkoutSession, PaymentStatusUpdate } from "../../dtos/paymentDto";

export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepo {
  constructor() {
    super(Payment);
  }

  async saveCheckoutSession(session: checkoutSession): Promise<void> {
    await this.create(session);
  }

  async getCheckoutSession(sessionId: string): Promise<IPayment | null> {
    return this.findOne({ sessionId });
  }

  async updatePaymentStatus(update: PaymentStatusUpdate): Promise<void> {
    await this.updateOne({ sessionId: update.sessionId }, { status: update.status, updatedAt: update.updateAt });
  }

  async getCustomerSessions(customerId: string): Promise<IPayment[]> {
    return this.find({ customerId });
  }
}
