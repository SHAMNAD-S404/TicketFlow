import React, { useState } from "react";
import UserLoginImg from "../../assets/images/userLoginPage.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginUser } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import regexPatterns, { RegexMessages } from "../../utils/regexPattern";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchEmployee } from "../../redux/employeeSlice";
import { Messages } from "@/enums/Messages";

interface UserLoginProps {
  forgotPassword: () => void;
}

export interface IemployeeLoginFormData {
  email: string;
  password: string;
}

const UserLogHome: React.FC<UserLoginProps> = ({ forgotPassword }) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IemployeeLoginFormData>();

  const handleLogin = async (data: IemployeeLoginFormData) => {
    setLoading(true);
    try {
      const response = await loginUser(data.email, data.password);

      if (response.success && response.isFirst) {
        localStorage.setItem("resetEmail", data.email);
        toast.success(response.message, {
          onClose: () => navigate("/auth/employee/create-new-password"),
        });
      } else if (response.success) {
        localStorage.setItem("userRole", response.role);
        await dispatch(fetchEmployee()).unwrap();
        toast.success(response.message);
        navigate("/employee/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to load user data. Please try again.");
        navigate("/auth/login?role=employee");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex phone:h-screen md:max-h-screen phone:p-2 md:p-16  ">
      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 h-5/6 flex items-center   rounded-2xl shadow-2xl shadow-gray-500 justify-center px-6 md:px-16 ">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome back...
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Fill the credentials to login to the user dashboard
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
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", {
                  required: RegexMessages.FEILD_REQUIRED,
                  pattern: {
                    value: regexPatterns.email,
                    message: RegexMessages.emailRegexMessage,
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4 ">
              <label
                htmlFor="password"
                className="block text-gray-800 font-medium mb-2"
              >
                Enter password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="****************"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("password", {
                    required: "this field is required",
                    // pattern: {
                    //   value: regexPatterns.password,
                    //   message: RegexMessages.passwordRegexMessage,
                    // },
                    minLength : {
                      value : 8,
                      message : RegexMessages.MINIMUM_LIMIT
                    },
                    maxLength : {
                      value : 15,
                      message : RegexMessages.MAXIMUM_LIMIT_REACHED
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className=" absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="text-right mb-6">
              <button
                onClick={forgotPassword}
                className="text-sm text-red-500 font-semibold hover:underline hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
      {/* Left Side: Image */}
      <div className="hidden md:flex w-1/2 h-5/6  rounded-2xl shadow-xl shadow-gray-400 items-center justify-center bg-blue-100">
        <img
          src={UserLoginImg}
          alt="Admin Illustration"
          className="object-cover w-3/4 h-5/5 "
        />
      </div>
    </div>
  );
};

export default UserLogHome;
