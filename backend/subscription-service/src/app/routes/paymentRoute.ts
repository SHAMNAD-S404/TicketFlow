import express, { Router } from "express";
import { PaymentController } from "../controllers/implementations/paymentController";
import { IPaymentController } from "../controllers/interface/IPaymentController";
import { PaymentService } from "../service/implements/paymentService";
import { IPaymentService } from "../service/interface/IPaymentService";
import { authenticateToken } from "../middlewares/authenticateToken";
import { extractUserData } from "../middlewares/extractUserData";


//dependency injection
const paymentService: IPaymentService = new PaymentService();
const paymentController: IPaymentController = new PaymentController(paymentService);

const router = Router();


//raw body data for the webhook only
router.post("/webhook",express.raw({ type: "application/json" }), paymentController.handleStripeWebhook);

//parse req body data to json for other routes
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post("/create-checkout-session",authenticateToken,paymentController.createCheckoutSession)
      .get("/get-order-details",authenticateToken,extractUserData,paymentController.getOrderDetails)

export default router;
