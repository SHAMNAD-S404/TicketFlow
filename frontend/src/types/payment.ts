export interface CheckoutItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }
  
  export interface CheckoutOptions {
    items: CheckoutItem[];
    customerId?: string;
    metadata?: Record<string, string>;
    successUrl?: string;
    cancelUrl?: string;
  }
  
  export interface PaymentSessionStatus {
    status: string;
    customerEmail?: string;
    amountTotal?: number;
    currency?: string;
  }