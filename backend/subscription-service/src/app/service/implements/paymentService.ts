import { secrets } from "../../../config/secrets";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { CreateCheckoutDTO } from "../../dtos/paymentDto";
import { IPayment, PaymentStatus } from "../../models/interface/IPayment";
import { IBaseResponse, IPaymentService } from "../interface/IPaymentService";
import Stripe from "stripe";
import { PaymentRepo } from "../../repositories/implements/paymentRepo";
import { IPaymentRepo } from "../../repositories/interface/IPaymentRepo";

const paymentRepo: IPaymentRepo = new PaymentRepo();

const stipe = new Stripe(secrets.stripe_secret_key, {
  apiVersion: "2025-03-31.basil",
});

export class PaymentService implements IPaymentService {
  async createCheckoutSession(data: CreateCheckoutDTO): Promise<any> {
    try {

      const session = await stipe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: data.companyEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: parseInt(data.amount) * 100,
              product_data: {
                name: `${data.plan} Plan`,
                description: `${data.planValidity} Subscription`,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          authUserUUID: data.authUserUUID,
          companyName: data.companyName,
          plan: data.plan,
          planStartDate: data.planStartDate,
          planEndDate: data.planEndDate,
          planValidity: data.planValidity,
        },
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
      });
      return session;
    } catch (error) {
      throw error;
    }
  }

  async handleSuccessfulPayment(session: Stripe.Checkout.Session): Promise<IBaseResponse> {
    try {
      const metadata = session.metadata;
      if (!metadata) {
        return {
          message: Messages.METADATA_MISSING,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      const paymentData: Partial<IPayment> = {
        authUserUUID: metadata.authUserUUID,
        companyName: metadata.companyName,
        companyEmail: session.customer_email as string,
        amount: (session.amount_total! / 100).toFixed(2),
        purchaseDate: new Date().toLocaleDateString(),
        plan: metadata.plan,
        planValidity: metadata.planValidity,
        planStartDate: metadata.planStartDate,
        planEndDate: metadata.planEndDate,
        paymentStatus: PaymentStatus.SUCCEEDED,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent?.toString() || "",
      };

      const storeData = await paymentRepo.create(paymentData as IPayment);
      if (storeData) {
        return {
          message: Messages.PURCHASE_SUCCESS,
          statusCode: HttpStatus.OK,
          success: true,
        };
      } else {
        return {
          message: Messages.ORDER_SAVING_FAILED,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
