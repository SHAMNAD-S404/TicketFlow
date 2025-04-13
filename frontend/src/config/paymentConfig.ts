export const PAYMENT_CONFIG = {
    // Base URL for your payment service
    API_URL:  'http://localhost:3000/subscription/api/payment',
    
    // Success and cancel URLs to redirect after payment
    SUCCESS_URL: 'http://localhost:5173/payment/success',
    CANCEL_URL:  'http://localhost:5173/payment/cancel',
    
    // Set to true to enable test mode
    TEST_MODE: process.env.NODE_ENV !== 'production',
  };