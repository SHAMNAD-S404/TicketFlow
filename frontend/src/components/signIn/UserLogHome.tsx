import React, { useState } from "react";
import { motion } from "framer-motion";
import UserLoginImg from "../../assets/images/userLoginPage.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginUser } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import regexPatterns, { RegexMessages } from "../../utils/regexPattern";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux store/store";
import { fetchEmployee } from "../../redux store/employeeSlice";
import getErrMssg from "../utility/getErrMssg";

interface UserLoginProps {
  forgotPassword: () => void;
}

export interface IemployeeLoginFormData {
  email: string;
  password: string;
}

const UserLogHome: React.FC<UserLoginProps> = ({ forgotPassword }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IemployeeLoginFormData>();

  const handleLogin = async (data: IemployeeLoginFormData) => {
    try {
      setLoading(true);
      const response = await loginUser(data.email, data.password);

      if (response.success && response.isFirst) {
        localStorage.setItem("resetEmail", data.email);
        toast.success(response.message, {
          onClose: () => navigate("/auth/employee/create-new-password"),
        });
      } else if (response.success) {
        localStorage.setItem("userRole", response.role);
        const getEmployee = await dispatch(fetchEmployee()).unwrap();
        if (getEmployee) toast.success(response.message);
        navigate("/employee/dashboard/dashboard");
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
      navigate("/auth/login?role=employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center h-screen bg-blue-50 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row w-full max-w-6xl h-4/6  bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Form Section */}
        <motion.article
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/2  p-6 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl md:text-3xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 hover:from-yellow-400 hover:via-orange-500 hover:to-blue-700 mb-2">
              Hey There! 👋
            </h1>
            <p className="text-black text-sm text-center font-serif  mb-6">
              Enter your details below and dive back into your personalized experience.
            </p>

            <form onSubmit={handleSubmit(handleLogin)} noValidate>
              {/* Email */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="jhonhonai@gmail.com"
                  {...register("email", {
                    required: RegexMessages.FEILD_REQUIRED,
                    pattern: {
                      value: regexPatterns.email,
                      message: RegexMessages.emailRegexMessage,
                    },
                  })}
                />
                {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "This field is required",
                      minLength: { value: 8, message: RegexMessages.MINIMUM_LIMIT },
                      maxLength: { value: 15, message: RegexMessages.MAXIMUM_LIMIT_REACHED },
                    })}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600">
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              {/* Forgot */}
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={forgotPassword}
                  className="text-sm text-red-500 font-medium hover:underline">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ${
                  loading ? "cursor-wait" : "cursor-pointer"
                }`}>
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </motion.article>

        {/* Image Section */}
        <motion.aside
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-blue-100 p-6">
          <img src={UserLoginImg} alt="User Login" className="object-contain" />
        </motion.aside>
      </motion.div>
    </section>
  );
};

export default UserLogHome;
