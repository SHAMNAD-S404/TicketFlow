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

export class PaymentController implements IPaymentController {
  private readonly paymentService: IPaymentService;
  constructor(PaymentService: IPaymentService) {
    this.paymentService = PaymentService;
  }

  public createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateData = CreateCheckoutSchema.safeParse(req.body);
      if (!validateData.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }
      const session = await this.paymentService.createCheckoutSession(validateData.data as CreateCheckoutDTO);
      res.status(HttpStatus.OK).json({
        message: Messages.SESSION_SUCCESS,
        success: true,
        sessionUrl: session.url,
      });
      return;
    } catch (error) {
      console.log(`${Messages.ERROR_WHILE} createcheckoutSession : `, error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  // hanle webhook
  public handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers["stripe-signature"]!;
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, signature, secrets.stripe_webhook_secret);
      } catch (error) {
        console.error(`${Messages.WEBHOOK_SIGN_FAIL} :`, error);
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.VERIFICATION_FAIL, success: false });
        return;
      }

      //hanlde checkout session completed event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const result = await this.paymentService.handleSuccessfulPayment(session);
        const { message, statusCode, success } = result;

        res.status(statusCode).json({ message, success });
        return;
      }
    } catch (error) {
      console.log(`${Messages.ERROR_WHILE} hanlde Stripe webhook : `, error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const { sessionId } = req.query;
      const { role } = res.locals.userData;
      
      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }
      if (!sessionId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.SESSION_ID_MISSING, success: false });
        return;
      }

      const result = await this.paymentService.getOrderDetailsService(sessionId as string);
      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });
    } catch (error) {
      console.log(`${Messages.ERROR_WHILE} get order details : `, error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };
}
