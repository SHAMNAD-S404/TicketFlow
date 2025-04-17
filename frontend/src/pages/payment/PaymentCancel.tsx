import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

const PaymentCancel: React.FC = () => {
  // Component states
  const [showContent, setShowContent] = useState<boolean>(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] p-4 bg-gradient-to-br from-red-50 to-orange-50 text-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 mt-10">
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="h-10 w-10 text-red-600" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-red-700">Payment Cancelled</h1>
          <p className="mt-2 text-gray-600">It looks like your payment was cancelled.</p>
        </motion.div>

        {/* Body */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
          className="mt-6 text-center">
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="text-lg text-gray-700">Your payment was not processed successfully.</p>
            <p className="text-gray-600 mt-2">
              Don't worry! You can repurchase your subscription from the subscription page at any time.
            </p>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-gray-200 rounded-xl shadow-md p-6">
            <p className="text-gray-600 mb-4">
              Ready to try again? Visit our subscription page to choose your plan and complete your purchase.
            </p>
            <Link to="/company/dashboard/subscription">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors">
                Go to Subscription Page
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer Message */}
          <motion.div variants={fadeInUp} className="text-center mt-6 text-gray-600 text-sm">
            <p>Need assistance? Contact our support team at ticketFlow@support.com.</p>
            <p>We’re here to help you get back on track!</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
