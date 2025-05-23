import { Request, Response } from "express";
import { IPaymentController } from "../interface/IPaymentController";
import { Messages } from "../../../constants/messageConstants";
import { HttpStatus } from "../../../constants/httpStatus";
import { CreateCheckoutSchema } from "../../dtos/checkoutValidator";
import { IPaymentService } from "../../service/interface/IPaymentService";
import { CreateCheckoutDTO } from "../../dtos/paymentDto";
import Stripe from "stripe";
import { secrets } from "../../../config/secrets";
import Roles from "../../../constants/Roles";

//stripe new instance
const stripe = new Stripe(secrets.stripe_secret_key, {
  apiVersion: "2025-03-31.basil",
});


/**
 * @class PaymentController
 * @description Handles incoming requests related to payments, orchestrating the flow
 * of data between the client and the payment service layer.
 * @implements {IPaymentController}
 */

export class PaymentController implements IPaymentController {

  /**
   * @type {IPaymentService}
   * @description Instance of the payment service, responsible for payment-specific business logic.
   */
  private readonly paymentService: IPaymentService;

  /**
   * @constructor
   * @param {IPaymentService} PaymentService - The dependency for the payment service.
   */ 

  constructor(PaymentService: IPaymentService) {
    this.paymentService = PaymentService;
  }

//========================= CREATE CHECKOUT SESSION =============================================

  public createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {

      //INPUT validation using zod schema
      const validateData = CreateCheckoutSchema.safeParse(req.body);
      if (!validateData.success) {
        res.status(HttpStatus.BAD_REQUEST)
           .json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }

      // create checkout session
      const session = await this.paymentService.createCheckoutSession(
        validateData.data as CreateCheckoutDTO
      );

      res.status(HttpStatus.OK).json({
        message: Messages.SESSION_SUCCESS,
        success: true,
        sessionUrl: session.url,
      });

    } catch (error) {

      console.log(`${Messages.ERROR_WHILE} createcheckoutSession : `, error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= HANLDE WEBHOOK ======================================================

  public handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
    try {

      const signature = req.headers["stripe-signature"]!;
      let event;

      try {

        event = stripe.webhooks.constructEvent(req.body, signature, secrets.stripe_webhook_secret);

      } catch (error) {

        console.error(`${Messages.WEBHOOK_SIGN_FAIL} :`, error);
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.VERIFICATION_FAIL, success: false });
        return;
      }

      //hanlde checkout session completed event
      if (event.type === "checkout.session.completed") {

        const session = event.data.object as Stripe.Checkout.Session;
        // if payment success then store data on the database
        const result = await this.paymentService.handleSuccessfulPayment(session);
        const { message, statusCode, success } = result;

        res.status(statusCode).json({ message, success });
      }
    } catch (error) {
      console.log(`${Messages.ERROR_WHILE} hanlde Stripe webhook : `, error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET ORDER DETAILS ======================================================

  public getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {

      const { sessionId } = req.query;
      const { role } = res.locals.userData;

      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      if (!sessionId) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.SESSION_ID_MISSING, success: false });
        return;
      }

      // Get order details from service
      const result = await this.paymentService.getOrderDetailsService(sessionId as string);
      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.log(`${Messages.ERROR_WHILE} get order details : `, error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET ALL PAYMENT HISTORY BY UUID =============================================

  public fetchOrderHistory = async (req: Request, res: Response): Promise<void> => {
    try {

      const { role, authUserUUID } = res.locals.userData;
      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      if (!authUserUUID) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.SESSION_ID_MISSING, success: false });
        return;
      }

      const getData = await this.paymentService.getAllPaymentHistoryService(authUserUUID as string);
      const { message, statusCode, success, data } = getData;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.log(`${Messages.ERROR_WHILE} fetch order history : `, error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= FETCH SUBSCRIPTION STATICS    =============================================

  public fetchSubsStatics = async (req: Request, res: Response): Promise<void> => {
    try {

      const { role } = res.locals.userData;
      if (role !== Roles.Admin) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const result = await this.paymentService.getRevanueAndCount();
      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {
      
      console.log(`${Messages.ERROR_WHILE} fetch sub statics : `, error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= *********************************=============================================
}
