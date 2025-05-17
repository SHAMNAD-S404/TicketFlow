import React, { useState } from "react";
import AdminLoginImg from "../../assets/images/adminLogin.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import regexPatterns, { RegexMessages } from "../../utils/regexPattern";
import { loginUser } from "../../api/services/authService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux store/store";
import { fetchCompany } from "../../redux store/userSlice";
import { LoginWithGoogle } from "../google/GoogleLogin";
import getErrMssg from "../utility/getErrMssg";
import { motion } from "framer-motion";

interface LoginProps {
  handleforgotPass: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

const Login: React.FC<LoginProps> = ({ handleforgotPass }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(data.email, data.password);
      if (response.success) {
        localStorage.setItem("userRole", response.role);
        const getCompanyData = await dispatch(fetchCompany()).unwrap();
        if (getCompanyData) toast.success(response.message);
        navigate("/company/dashboard/dashboard");
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
      navigate("/auth/login?role=admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white phone:bg-blue-50 p-2 md:p-10">
      <motion.section
        className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl bg-white md:bg-blue-200 shadow-none md:shadow-xl rounded-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}>
        {/* Left Image */}
        <motion.aside
          className="hidden md:flex w-full md:w-4/5 md:h-full justify-center items-center bg-blue-200 rounded-l-2xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <img src={AdminLoginImg} alt="Admin Login" className="object-cover rounded-2xl max-h-[500px]" />
        </motion.aside>

        {/* Login Form */}
        <motion.section
          className="w-full md:w-3/5 h-full bg-blue-100 rounded-2xl px-6 py-10 md:px-16 flex justify-center items-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}>
          <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={{}}>
            <motion.header className="mb-8 text-center md:text-left" variants={fadeInUp} custom={0}>
              <h1 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-900 hover:from-yellow-400 hover:via-orange-500 hover:to-blue-700 ">
                Administrator Login
              </h1>
              <p className="text-black font-serif text-center text-sm mt-2">
                Log in below to access and oversee the company admin dashboard.
              </p>
            </motion.header>

            <motion.form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              {/* Email */}
              <motion.div variants={fadeInUp} custom={1}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Enter email to login
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="infexsolutions@gmail.com"
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email", {
                    required: RegexMessages.FEILD_REQUIRED,
                    pattern: {
                      value: regexPatterns.email,
                      message: RegexMessages.INVALID_FIELD_VALUE,
                    },
                  })}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1 ms-2">{errors.email.message}</p>}
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeInUp} custom={2}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                  Enter password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="****************"
                    className={`w-full px-4 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    {...register("password", {
                      required: RegexMessages.FEILD_REQUIRED,
                      minLength: {
                        value: 8,
                        message: "Password must be at least 6 characters",
                      },
                      maxLength: {
                        value: 15,
                        message: "Password must be at most 15 characters",
                      },
                      pattern: {
                        value: regexPatterns.newLoginPassValidation,
                        message: RegexMessages.newLoginPassValidationMssg,
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600">
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </motion.div>

              {/* Forgot Password */}
              <motion.div className="text-right" variants={fadeInUp} custom={3}>
                <button
                  type="button"
                  onClick={handleforgotPass}
                  className="text-blue-600 hover:text-orange-600 hover:underline text-sm font-medium">
                  Forgot Password?
                </button>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                variants={fadeInUp}
                custom={4}
                whileHover={{ scale: 1.03 }}
                className={`w-full py-2 px-4 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  loading
                    ? "cursor-wait bg-black"
                    : "cursor-pointer bg-indigo-600 hover:bg-gradient-to-t from-lime-500 to-green-500 hover:text-black"
                }`}>
                {loading ? "Logging in..." : "Log in"}
              </motion.button>

              {/* Error */}
              {error && (
                <motion.p className="text-red-500 mt-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {error}
                </motion.p>
              )}
            </motion.form>

            {/* Divider + Google */}
            <motion.div className="my-6" variants={fadeInUp} custom={5}>
              <hr className="my-3" />
              <p className="text-center text-gray-700">OR</p>
              <LoginWithGoogle />
            </motion.div>

            {/* Footer */}
            <motion.footer className="mt-4 text-center text-sm text-gray-600" variants={fadeInUp} custom={6}>
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-red-500 font-semibold hover:underline hover:text-blue-500">
                Register
              </Link>
            </motion.footer>
          </motion.div>
        </motion.section>
      </motion.section>
    </main>
  );
};

export default Login;
