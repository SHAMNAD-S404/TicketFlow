import React from "react";
import { motion } from "framer-motion";
import VerifyEmail from "../../assets/images/verifyemail .png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import regexPatterns from "../../utils/regexPattern";
import { IVerifyEmail } from "../../types/auth";
import { verifyEmail } from "../../api/services/authService";
import { toast } from "react-toastify";
import GoogleSignIn from "../google/GoogleSignup";
import getErrMssg from "../utility/getErrMssg";

interface SignupFormProps {
  onVerifyEmail: () => void;
}

const Signup_Email: React.FC<SignupFormProps> = ({ onVerifyEmail }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IVerifyEmail>();

  const formSubmit = async (data: IVerifyEmail) => {
    localStorage.setItem("email", data.email);
    const email = data.email;

    try {
      const response = await verifyEmail(email);
      if (response.success) {
        onVerifyEmail();
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-blue-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left: Image */}
        <motion.aside
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex w-1/2 items-center justify-center bg-blue-100 p-6">
          <img src={VerifyEmail} alt="Signup Illustration" className="mh-auto object-contain" />
        </motion.aside>

        {/* Right: Form */}
        <motion.article
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full md:w-1/2 px-6 md:px-10 py-10 bg-blue-50 flex flex-col justify-center">
          <header className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Register Your Company</h2>
            <hr className="my-3" />
            <p className="text-sm text-gray-600">
              Let’s get you all set up so you can start creating your company account.
            </p>
            <h4 className="mt-3 text-lg md:text-xl font-semibold text-blue-600">Verify your email</h4>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit(formSubmit)} noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Enter company email</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: regexPatterns.email,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:font-bold hover:bg-gradient-to-r from-blue-500 to-green-500 transition duration-200">
                Verify email
              </button>
              <hr className="my-4" />
              <p className="text-center text-gray-600">OR</p>
              <GoogleSignIn />
              <p className="text-center text-gray-600 text-sm mt-4">
                Already have an account?{" "}
                <Link
                  to="/auth/login?role=admin"
                  className="text-purple-500 hover:underline font-medium hover:text-blue-600">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </motion.article>
      </motion.div>
    </section>
  );
};

export default Signup_Email;
