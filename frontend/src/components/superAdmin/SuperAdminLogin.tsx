import React, { useState } from "react";
import SudoLogin from "../../assets/images/sudologin.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginSuperAdmin } from "../../api/services/authService";
import { toast } from "react-toastify";
import regexPatterns, { RegexMessages } from "../../utils/regexPattern";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux store/store";
import { setUser } from "../../redux store/sudoSlice";
import getErrMssg from "../utility/getErrMssg";
import { motion } from "framer-motion";

interface LoginFormData {
  email: string;
  password: string;
}

const SuperAdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await loginSuperAdmin(data.email, data.password);
      if (response.success) {
        localStorage.setItem("userRole", response.role);
        const userData = { role: response.role, email: data.email };
        dispatch(setUser(userData));
        toast.success(response.message);
        navigate("/sudo/dashboard/subscription");
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
    }
  };

  return (
    <main className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-tr from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Left Section */}
      <aside className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2 p-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 text-transparent bg-clip-text">
          TicketFlow Admin
        </motion.h1>
        <motion.img
          src={SudoLogin}
          alt="Super Admin"
          className="max-w-md object-contain"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 1 }}
        />
      </aside>

      {/* Right Section */}
      <section className="flex flex-1 justify-center items-center px-6 md:px-12 py-10 bg-black bg-opacity-70">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-gray-900 p-8 rounded-2xl shadow-2xl shadow-purple-800/40 backdrop-blur-md">
          <header className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, Admin</h2>
            <p className="text-sm text-gray-400">Login to your dashboard</p>
          </header>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="admin@example.com"
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: regexPatterns.email,
                    message: RegexMessages.emailRegexMessage,
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********"
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                {...register("password", {
                  required: RegexMessages.FEILD_REQUIRED,
                  minLength: {
                    value: 8,
                    message: RegexMessages.MINIMUM_LIMIT,
                  },
                  maxLength: {
                    value: 15,
                    message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                  },
                })}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-white">
                {showPassword ? "🙉" : "🙈"}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-orange-500 hover:to-purple-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-300">
              Sign In
            </motion.button>
          </form>
        </motion.div>
      </section>
    </main>
  );
};

export default SuperAdminLogin;
