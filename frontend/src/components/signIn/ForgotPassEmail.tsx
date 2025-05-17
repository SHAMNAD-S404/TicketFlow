import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import ForgotImg from "../../assets/images/forgot2.png";
import { IoMdArrowRoundBack } from "react-icons/io";
import regexPatterns from "@/utils/regexPattern";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { forgotPasswordReq } from "@/api/services/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import getErrMssg from "../utility/getErrMssg";

interface ForgotPassEmailProps {
  userType: "admin" | "user";
  onBacktoLogin: () => void;
}

const ForgotPassEmail: React.FC<ForgotPassEmailProps> = ({ onBacktoLogin }) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const email = inputRef.current?.value;
    if (!regexPatterns.email.test(email as string)) {
      toast.error(Messages.EMAIL_INVALID);
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPasswordReq(email as string);
      if (response) {
        Swal.fire({
          title: "Success",
          text: response.message,
          icon: "success",
        }).then(() => navigate("/"));
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-blue-50 p-4">
      {/* Left Side - Form */}
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-blue-100 shadow-lg rounded-2xl p-6 md:p-10 w-full max-w-xl md:mr-6 mb-6 md:mb-0">
        <button
          onClick={onBacktoLogin}
          className="text-blue-600 hover:text-purple-600 flex items-center font-medium mb-6">
          <IoMdArrowRoundBack className="mr-1 text-lg" />
          Back to login
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot your <span className="text-blue-600">password?</span>
        </h1>
        <p className="text-gray-600 font-medium mb-6">
          Don’t worry — it happens to all of us. Enter your email below to recover your password.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword();
          }}>
          <input
            ref={inputRef}
            type="email"
            placeholder="Enter your registered email ID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-orange-600 hover:text-black transition ease-in-out duration-300">
            {loading ? "Processing..." : "Submit"}
          </motion.button>
        </form>
      </motion.article>

      {/* Right Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="hidden md:flex md:w-1/2 items-center justify-center">
        <img src={ForgotImg} alt="Forgot Password Illustration" className="w-[80%] h-[80%] object-contain rounded-xl" />
      </motion.div>
    </section>
  );
};

export default ForgotPassEmail;
