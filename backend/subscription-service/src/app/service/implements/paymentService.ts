import { IPaymentService } from "../interface/IPaymentService";
import { IPaymentRepo } from "../../repositories/interface/IPaymentRepo";
import { CheckoutSessionRequest, PaymentSessionStatus } from "../../dtos/paymentDto";
import Stripe from "stripe";

export class PaymentService implements IPaymentService {
  private stripe: Stripe;
  private paymentRepo: IPaymentRepo;
  private frontendUrl: string;

  constructor(stripeSecretKey: string, paymentRepo: IPaymentRepo) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-03-31.basil",
    });
    this.paymentRepo = paymentRepo;
    this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  }

  async createCheckoutSession(data: CheckoutSessionRequest): Promise<{ sessionId: string; url: string }> {
    const { items, customerId, metadata, successUrl, cancelUrl } = data;

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description || "",
        },
        unit_amount: Math.round(Number(item.price) * 100), // Stripe requires amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer: customerId || undefined,
      success_url: successUrl || `${this.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${this.frontendUrl}/payment/cancel`,
      metadata: {
        ...metadata,
      },
    });

    // Save session info to database
    await this.paymentRepo.saveCheckoutSession({
      sessionId: session.id,
      customerId,
      amount: session.amount_total || 0,
      status: session.payment_status,
      metadata: metadata || {},
      createdAt: new Date(),
    });

    return { sessionId: session.id, url: session.url as string };
  }

  async getSessionStatus(sessionId: string): Promise<PaymentSessionStatus> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    return {
      status: session.payment_status,
      customerEmail: session.customer_details?.email as string,
      amountTotal: Number(session.amount_total),
      currency: session.currency as string,
    };
  }

  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    console.log(`Processing webhook event: ${event.type}`);
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 Payment succeeded for session: ${session.id}`);
        
        // Update payment status in your database
        await this.paymentRepo.updatePaymentStatus({
          sessionId: session.id,
          status: 'paid',
          updateAt: new Date(),
        });
        
        // Here you could also call other microservices to update order status, etc.
        // Example: notify your order service about successful payment
        break;
        
      case 'checkout.session.async_payment_succeeded':
        const asyncSession = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 Async payment succeeded for session: ${asyncSession.id}`);
        
        await this.paymentRepo.updatePaymentStatus({
          sessionId: asyncSession.id,
          status: 'paid',
          updateAt: new Date(),
        });
        break;
        
      case 'checkout.session.async_payment_failed':
        const failedAsyncSession = event.data.object as Stripe.Checkout.Session;
        console.log(`❌ Async payment failed for session: ${failedAsyncSession.id}`);
        
        await this.paymentRepo.updatePaymentStatus({
          sessionId: failedAsyncSession.id,
          status: 'failed',
          updateAt: new Date(),
        });
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Payment failed for intent: ${paymentIntent.id}`);
        
        if (paymentIntent.metadata?.checkout_session_id) {
          await this.paymentRepo.updatePaymentStatus({
            sessionId: paymentIntent.metadata.checkout_session_id,
            status: 'failed',
            updateAt: new Date(),
          });
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
