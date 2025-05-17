import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Verify from "../../assets/images/verify.png";
import { otpVerification, resendOTP } from "../../api/services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { showCustomeAlert } from "../utility/swalAlertHelper";
import Swal from "sweetalert2";
import getErrMssg from "../utility/getErrMssg";

interface OtpVerificationProps {
  onSignupForm: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ onSignupForm }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(119);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) inputRef.current[index + 1]?.focus();
  };

  const handleCancel = async () => {
    const result = await showCustomeAlert({
      title: "Are you sure?",
      text: "You will be redirected to home.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      Swal.fire({ text: "Cancelled", icon: "success" }).then(() => {
        localStorage.clear();
        navigate("/");
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const email = localStorage.getItem("email");
      if (!email) return toast.error("Something went wrong. Try again!");
      const response = await resendOTP(String(email));
      if (response.success) {
        setTimer(239);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpVerify = async () => {
    try {
      const otpValue = otp.join("");
      if (otpValue.length !== 4) return toast.error("Please enter valid OTP");
      const email = localStorage.getItem("email");
      if (!email) {
        toast.error("Registration failed. Try again!", {
          onClose: () => {
            localStorage.removeItem("signupStep");
            localStorage.removeItem("email");
          },
        });
        return;
      }
      setLoading(true);
      const response = await otpVerification(otpValue, email);
      if (response.success) {
        toast.success(response.message);
        onSignupForm();
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="bg-white rounded-2xl shadow-lg phone:p-6 md:p-10 max-w-6xl w-full grid md:grid-cols-2 gap-6">
        {/* Left Section */}
        <article className="flex flex-col justify-center space-y-6">
          <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Verify Your Code</h1>
            <p className="text-gray-600">We’ve sent an OTP to your registered email.</p>
          </header>

          <div className="flex justify-center gap-4 mt-4">
            {otp.map((value, index) => (
              <motion.input
                whileFocus={{ scale: 1.1 }}
                key={index}
                ref={(el) => (inputRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-all duration-200"
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-600">
            Didn’t receive a code?{" "}
            {timer === 0 ? (
              <button
                disabled={isResending}
                onClick={handleResendOtp}
                className={`text-blue-600 font-semibold hover:underline transition duration-150 ${
                  isResending && "opacity-50 cursor-not-allowed"
                }`}>
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            ) : (
              <span className="text-red-500 font-medium">
                Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
              </span>
            )}
          </div>

          <footer className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleOtpVerify}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-green-500 text-white py-2 rounded-lg font-semibold text-lg transition">
              {loading ? "Verifying..." : "Verify OTP"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleCancel}
              className="w-full bg-red-500 hover:bg-black text-white py-2 rounded-lg font-semibold text-lg">
              Cancel
            </motion.button>
          </footer>
        </article>

        {/* Right Section */}
        <aside className="hidden md:flex items-center justify-center rounded-xl overflow-hidden bg-blue-100">
          <motion.img
            src={Verify}
            alt="Verification Illustration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-auto object-contain p-6"
          />
        </aside>
      </motion.section>
    </main>
  );
};

export default OtpVerification;
