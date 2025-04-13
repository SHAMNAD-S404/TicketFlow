import express from 'express';
import { PaymentController } from '../controllers/implementations/paymentController';
import {  webhookMiddleware } from '../middlewares/webhookVerification';

export const configurePaymentRoutes = (paymentController: PaymentController) => {
  const router = express.Router();

   // Apply raw body handling middleware only to webhook route
   router.post('/webhook', webhookMiddleware, paymentController.handleWebhook.bind(paymentController));

   // Apply JSON parsing middleware to all other routes
  router.use(express.json());

  // Payment routes
  router.post('/create-checkout-session', paymentController.createCheckoutSession.bind(paymentController));
  router.get('/session/:sessionId', paymentController.getSessionStatus.bind(paymentController));

  return router;
};