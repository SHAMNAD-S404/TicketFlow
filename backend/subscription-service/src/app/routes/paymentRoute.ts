import { Router } from "express";
import { PaymentController } from "../controllers/implementations/paymentController";
import { IPaymentController } from "../controllers/interface/IPaymentController";

const router = Router()
const paymentController : IPaymentController = new PaymentController();

router.post('/create-checkout-session',paymentController.createStripeSession)


export default router;
