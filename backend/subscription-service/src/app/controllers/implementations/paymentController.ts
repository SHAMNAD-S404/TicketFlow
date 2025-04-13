// src/app/controllers/implementation/paymentController.ts
import { Request, Response } from "express";
import { IPaymentController } from "../interface/IPaymentController";
import { IPaymentService } from "../../service/interface/IPaymentService";
import { CheckoutSessionRequest } from "../../dtos/paymentDto";
import Stripe from "stripe";

export class PaymentController implements IPaymentController {
  private paymentService: IPaymentService;
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(paymentService: IPaymentService, stripeSecretKey: string, webhookSecret: string) {
    this.paymentService = paymentService;
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-03-31.basil",
    });
    this.webhookSecret = webhookSecret;
  }

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const checkoutData = req.body as CheckoutSessionRequest;

      if (!checkoutData.items || checkoutData.items.length === 0) {
        res.status(400).json({ error: "No items provided" });
        return;
      }

      const result = await this.paymentService.createCheckoutSession(checkoutData);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  }

  async getSessionStatus(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const status = await this.paymentService.getSessionStatus(sessionId);
      res.status(200).json(status);
    } catch (error) {
      console.error("Error retrieving session:", error);
      res.status(500).json({ error: "Failed to retrieve session" });
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      // For Stripe CLI, the raw body is available directly from the request
      const payload = req.body;
      
      // Verify webhook signature
      event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.webhookSecret
      );

      console.log(`✅ Webhook received: ${event.type}`);

      // Process the event
      await this.paymentService.handleStripeWebhook(event);
      
      res.status(200).json({ received: true });
    } catch (err) {
      console.error(`❌ Webhook error: ${err}`);
      res.status(400).send(`Webhook Error: ${err}`);
    }
  }
}
