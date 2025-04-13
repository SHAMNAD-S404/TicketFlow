import { CheckoutOptions, PaymentSessionStatus } from "@/types/payment";
import { PAYMENT_CONFIG } from "@/config/paymentConfig";
import axiosInstance from "../axiosInstance";

export const PaymentAPI = {
  createCheckoutSession: async (options: CheckoutOptions): Promise<{ sessionId: string; url: string }> => {
    try {
      // Add success and cancel URLs from config if not provided
      const checkoutOptions = {
        ...options,
        successUrl: options.successUrl || PAYMENT_CONFIG.SUCCESS_URL,
        cancelUrl: options.cancelUrl || PAYMENT_CONFIG.CANCEL_URL,
      };

      const response = await axiosInstance.post(`${PAYMENT_CONFIG.API_URL}/create-checkout-session`, checkoutOptions);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSessionStatus: async (sessionId: string): Promise<PaymentSessionStatus> => {
    try {
      const response = await axiosInstance.get(`${PAYMENT_CONFIG.API_URL}/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
