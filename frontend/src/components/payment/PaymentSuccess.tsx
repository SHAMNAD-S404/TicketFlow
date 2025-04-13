// src/components/payment/PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PaymentAPI } from '@/api/services/subscription_service';
import { PaymentSessionStatus } from '@/types/payment';
import { GiMoneyStack } from "react-icons/gi";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { MdError } from "react-icons/md";

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentSessionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No session ID found in URL');
      setLoading(false);
      return;
    }
    
    const fetchSessionStatus = async () => {
      try {
        const status = await PaymentAPI.getSessionStatus(sessionId);
        setPaymentStatus(status);
      } catch (err) {
        console.error('Error fetching payment status:', err);
        setError('Failed to load payment status. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionStatus();
  }, [searchParams]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <FaSpinner className="text-blue-600 text-4xl animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying your payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your subscription.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <MdError className="text-red-600 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/subscription" 
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Return to Subscription
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          {paymentStatus?.status === 'paid' ? (
            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
          ) : (
            <FaSpinner className="text-yellow-500 text-5xl animate-spin mb-4" />
          )}
          
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            {paymentStatus?.status === 'paid' ? 'Payment Successful!' : 'Payment Processing'}
            <GiMoneyStack className="text-green-600 text-3xl" />
          </h1>
          
          {paymentStatus && (
            <div className="bg-gray-50 p-4 rounded-lg w-full mb-6 border border-gray-200">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold">Status:</span>
                <span className={`font-bold ${
                  paymentStatus.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {paymentStatus.status === 'paid' ? 'Paid' : 'Processing'}
                </span>
              </div>
              
              {paymentStatus.customerEmail && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold">Email:</span>
                  <span>{paymentStatus.customerEmail}</span>
                </div>
              )}
              
              {paymentStatus.amountTotal && (
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold">Amount:</span>
                  <span className="font-bold">
                    ₹{(paymentStatus.amountTotal / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <Link 
            to="/dashboard" 
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

