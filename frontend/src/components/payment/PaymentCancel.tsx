// src/components/payment/PaymentCancel.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MdCancel } from "react-icons/md";

export const PaymentCancel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <MdCancel className="text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled and you have not been charged.
            If you have any questions, please contact our support team.
          </p>
          <Link 
            to="/subscription" 
            className="bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Return to Subscription Plans
          </Link>
        </div>
      </div>
    </div>
  );
};