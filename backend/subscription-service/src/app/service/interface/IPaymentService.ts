import {checkoutSession , CheckoutSessionRequest, PaymentSessionStatus} from "../../dtos/paymentDto"
import Stripe from "stripe";

export interface IPaymentService {
    createCheckoutSession (data:CheckoutSessionRequest) : Promise<{ sessionId : string ; url:string }>
    getSessionStatus (sessionId : string) : Promise<PaymentSessionStatus>;
    handleStripeWebhook(event : Stripe.Event) : Promise<void>;
}

