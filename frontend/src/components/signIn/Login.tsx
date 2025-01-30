import React, { useState } from "react";
import AdminLoginImg from "../../assets/images/adminLogin.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import regexPatterns from "../../utils/regexPattern";
import { loginUser } from "../../api/services/authService";

interface LoginProps {
  handleforgotPass: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ handleforgotPass }) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
     
      const response = await loginUser(data.email,data.password);
      if(response.success){
          localStorage.setItem("userRole",response.role)
        toast.success(response.message, {
          onClose: () => navigate("/company/dashboard")
        })
      }else{
        toast.error(response.message);
      }
     
    } catch (error : any) {
        if(error.response && error.response.data){
          toast.error(error.response.data.message);
        }else{
          alert("Error logging in account. Please try again.");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex phone:h-screen md:max-h-screen phone:p-2 md:p-10 gap-  bg-white">
      {/* Left Side: Image */}
      <div className="hidden md:flex w-1/2  rounded-2xl shadow-xl items-center justify-center bg-blue-200">
        <img
          src={AdminLoginImg}
          alt="Admin Illustration"
          className="object-cover w-4/4 h-4/4 rounded-2xl"
        />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 bg-blue-100 flex items-center rounded-2xl shadow-2xl justify-center px-6 md:px-16 ">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome back Admin
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Fill the credentials to login to the company admin dashboard
          </p>

          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-800 font-medium mb-2"
              >
                Enter email to login
              </label>
              <input
                type="email"
                id="email"
                placeholder="flip2@gmail.com"
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: regexPatterns.email,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-800 font-medium mb-2"
              >
                Enter password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="****************"
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    maxLength: {
                      value: 15,
                      message: "Password must be at most 15 characters",
                    },
                    pattern: {
                      value: regexPatterns.password,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className=" absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600 "
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            <div className="text-right mb-6">
              <button
                onClick={handleforgotPass}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Loggin in..." : "Log in"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>

          <p className="mt-6 text-center text-gray-600  ">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-red-500 font-semibold hover:underline hover:text-blue-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
