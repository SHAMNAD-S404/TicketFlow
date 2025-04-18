import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { OrderDetails } from "@/interfaces/orderDetails.interface";
import { getOrderDetails } from "@/api/services/subscription_service";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { Check, FileText, User, Calendar, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { usePDF } from "react-to-pdf";
import { IoMdDownload } from "react-icons/io";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  //component states
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);

  const navigate = useNavigate();
  //pdf download config
  const { toPDF, targetRef } = usePDF({ filename: `${order?.plan} invoice.pdf` || `invoice.pdf` });

  //component functions
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    toast.error(Messages.SESSION_ID_MISSING);
    return null;
  }

  //timer variable
  let timeOut: ReturnType<typeof setTimeout>;
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderDetails(sessionId);
      setOrder(response.data);
    } catch (error: any) {
      if (error.response?.status === 404 && retryCount < 2) {
        //retry after short delay
        timeOut = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, 1000);
      } else {
        setError(Messages.FETCH_ORDER_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails();
    } else {
      setError(Messages.INVALID_PAY_REFERENCE);
      setLoading(false);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [sessionId, retryCount]);

  useEffect(() => {
    // Trigger animation after content loads
    if (!loading && order) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

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

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] p-4 bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 mt-10">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-indigo-700">Payment Successful</h1>
          <p className="mt-2 text-gray-600">Thank you for choosing our services!</p>
        </motion.div>

        {/* Body */}
        <div className="mt-6">
          {loading ? (
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center justify-center gap-2 py-12">
              <div className="flex space-x-2">
                <div
                  className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce"
                  style={{ animationDelay: "0s" }}></div>
                <div
                  className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce"
                  style={{ animationDelay: "0.2s" }}></div>
                <div
                  className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce"
                  style={{ animationDelay: "0.4s" }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-6">Fetching order details...</p>
            </motion.div>
          ) : error ? (
            <div className="text-center text-red-500 font-semibold p-8">{error}</div>
          ) : order && showContent ? (
            <div>
              <div className="flex items-center justify-end mb-2 gap-3 text-sm font-semibold">
                <button
                  className="bg-blue-500 p-2 text-white rounded-xl px-4 hover:bg-green-500 flex items-center gap-2 "
                  onClick={() => toPDF()}>
                  download <IoMdDownload />
                </button>
                <button
                  className="bg-violet-600 p-2 hover:bg-black text-white rounded-xl px-4 flex items-center gap-2 "
                  onClick={() => navigate("/company/dashboard/subscription")}>
                  view subscription
                  <FaArrowAltCircleRight />
                </button>
              </div>

              <motion.div
                variants={container}
                ref={targetRef}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-r from-white to-blue-50 border border-gray-200 rounded-xl shadow-md p-6">
                {/* Invoice Header */}
                <motion.div
                  variants={fadeInUp}
                  className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center">
                    <FileText className="mr-2 text-indigo-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                      <p className="text-sm text-gray-500">Order ID: ORID-{String(order._id).slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-4">
                      Date: {new Date(order.purchaseDate).toLocaleDateString()}
                    </p>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="inline-flex items-center bg-green-100 px-2 py-1 rounded-full text-green-600 text-sm font-medium">
                      <Check className="h-4 w-4 mr-1" /> {order.paymentStatus}
                    </motion.span>
                  </div>
                </motion.div>

                {/* Customer and Plan Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <motion.div variants={fadeInUp} className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="text-md font-semibold text-indigo-700">Billed To</h3>
                    </div>
                    <p className="text-gray-800 font-medium">{order.companyName}</p>
                    <p className="text-gray-600 text-sm">{order.companyEmail}</p>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="text-md font-semibold text-indigo-700">Plan Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <p className="text-gray-600">Plan:</p>
                      <p className="text-gray-800 font-medium">{order.plan}</p>

                      <p className="text-gray-600">Start Date:</p>
                      <p className="text-gray-800">{order.planStartDate}</p>

                      <p className="text-gray-600">End Date:</p>
                      <p className="text-gray-800">{order.planEndDate}</p>

                      <p className="text-gray-600">Validity:</p>
                      <p className="text-gray-800">{order.planValidity}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Amount Section */}
                <motion.div variants={fadeInUp} className="border-t border-gray-200 pt-4 mt-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 mr-2" />
                      <span className="text-lg font-semibold">Total Amount</span>
                    </div>
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5, type: "spring" }}
                      className="text-2xl font-bold">
                      ₹{order.amount}
                    </motion.span>
                  </div>
                </motion.div>

                {/* Thank You Message */}
                <motion.div variants={fadeInUp} className="text-center mt-6 text-gray-600 text-sm">
                  <p>Thank you for choosing our services!</p>
                  <p>An email receipt has been sent to your registered email address.</p>
                </motion.div>
              </motion.div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
