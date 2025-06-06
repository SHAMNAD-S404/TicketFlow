import { secrets } from "../../../config/secrets";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { CreateCheckoutDTO } from "../../dtos/paymentDto";
import { IPayment } from "../../models/interface/IPayment";
import Stripe from "stripe";
import { PaymentRepo } from "../../repositories/implements/paymentRepo";
import { IPaymentRepo } from "../../repositories/interface/IPaymentRepo";
import { paymentStatus } from "../../../src/generated/prisma";
import { publishToQueue } from "../../../queues/publisher";
import { RabbitMQConfig } from "../../../config/rabbitMQConfig";
import {
  IBaseResponse,
  IPaymentHistoryRes,
  IPaymentService,
  IRevanuAndCountResp,
  orderDetailsResponse,
} from "../interface/IPaymentService";

// INSTANCE PAYMENT REPO CLASS
const paymentRepo: IPaymentRepo = new PaymentRepo();

// STRIPE INSTANCE
const stipe = new Stripe(secrets.stripe_secret_key, {
  apiVersion: "2025-03-31.basil",
});


/**
 * @class PaymentService
 * @description Implements the core business logic for managing payment-related operations.
 * This service processes requests from controllers and interacts with data access layers
 * (e.g., repositories) for payment data persistence and retrieval.
 * @implements {IPaymentService}
 */

export class PaymentService implements IPaymentService {

//========================= CREATE CHECKOUT SESSION =============================================
  async createCheckoutSession(data: CreateCheckoutDTO): Promise<any> {
    
      const session = await stipe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: data.companyEmail,
        line_items: [
          {
            price_data: {
              currency: "inr",
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
        success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: data.cancelUrl,
      });
      return session;
  }

//========================= HANLDE SUCCESSFUL PAYMENT ==============================================

  async handleSuccessfulPayment(session: Stripe.Checkout.Session): Promise<IBaseResponse> {
    
      const metadata = session.metadata;
      if (!metadata) {
        return {
          message: Messages.METADATA_MISSING,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      // Creating Payment Data for storing in DB
      const paymentData: IPayment = {
        authUserUUID: metadata.authUserUUID,
        companyName: metadata.companyName,
        companyEmail: session.customer_email as string,
        amount: (session.amount_total! / 100).toFixed(2),
        purchaseDate: new Date().toLocaleDateString(),
        plan: metadata.plan,
        planValidity: metadata.planValidity,
        planStartDate: metadata.planStartDate,
        planEndDate: metadata.planEndDate,
        paymentStatus: paymentStatus.succeeded,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent?.toString() || "",
      };

      // store data in DB.
      const storeData = await paymentRepo.create(paymentData);
      if (storeData) {

        //payload for sending to company queue
        const companyPayload = {
          eventType: "subscription-purchase-update",
          companyUUID: storeData.authUserUUID,
          subscriptionPlan: storeData.plan,
          subscriptionEndDate: storeData.planEndDate,
          isSubscriptionExpired: false,
        };

        //publish to company queue
        publishToQueue(RabbitMQConfig.COMPANY_QUEUE, companyPayload);

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
  }
//========================= GET ORDER DETAILS OF  PAYMENT  =============================================

  async getOrderDetailsService(sessionId: string): Promise<orderDetailsResponse> {

     //FIND ONE DOCUMENT 
      const result = await paymentRepo.findOneDocument({ stripeSessionId: sessionId });
      if (result) {
        return {
          message: Messages.FETCH_SUCCESS,
          statusCode: HttpStatus.OK,
          success: true,
          data: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
        };
      }
  }

//========================= GET ALL PAYMENT HISTORY =============================================

  async getAllPaymentHistoryService(authUserUUID: string): Promise<IPaymentHistoryRes> {
    
      const result = await paymentRepo.getAllPaymentsByAuthUUID(authUserUUID);
      if (result) {
        return {
          message: Messages.FETCH_SUCCESS,
          success: true,
          statusCode: HttpStatus.OK,
          data: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
  }

//========================= GET REVANUE COUNT ======================================================

  async getRevanueAndCount(): Promise<IRevanuAndCountResp> {
    
      const [revenue, order] = await Promise.all([
        paymentRepo.getTotalRevanue(),
        paymentRepo.getTotalOrdersCount(),
      ]);
      if (!revenue || !order) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      return {
        message: Messages.FETCH_SUCCESS,
        success: true,
        statusCode: HttpStatus.OK,
        data: {
          totalOrders: order,
          totalRevenue: revenue,
        },
      };
  }
//========================= ******************************** =============================================
}
