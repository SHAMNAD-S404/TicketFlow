import { Request, Response } from "express";

export interface IPaymentController {
  createCheckoutSession(req: Request, res: Response): Promise<void>;
  handleStripeWebhook(req: Request, res: Response): Promise<void>;
}
