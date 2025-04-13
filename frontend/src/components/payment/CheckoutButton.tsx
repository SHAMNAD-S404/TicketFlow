import React, { useState } from 'react';
import { CheckoutItem } from '@/types/payment';
import { PaymentAPI } from '@/api/services/subscription_service';

interface CheckoutButtonProps {
  items: CheckoutItem[];
  customerId?: string;
  metadata?: Record<string, string>;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  onError?: (error: Error) => void;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  items,
  customerId,
  metadata,
  buttonText = 'Checkout',
  className = '',
  disabled = false,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;

    setIsLoading(true);
    try {
      const { url } = await PaymentAPI.createCheckoutSession({
        items,
        customerId,
        metadata
      });
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className={`checkout-button ${className}`}
      disabled={disabled || isLoading || items.length === 0}
    >
      {isLoading ? 'Processing...' : buttonText}
    </button>
  );
};
