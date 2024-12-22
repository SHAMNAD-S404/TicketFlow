import React, { useState } from "react";
import UserLoginImg from "../../assets/images/userLoginPage.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface UserLoginProps {
  forgotPassword: () => void;
}

const UserLogHome: React.FC<UserLoginProps> = ({ forgotPassword }) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex phone:h-screen md:max-h-screen phone:p-2 md:p-10  bg-white">
      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center rounded-2xl shadow-2xl justify-center px-6 md:px-16 ">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome back...
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Fill the credentials to login to the user dashboard
          </p>

          <form>
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
              />
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
                id="password"
                placeholder="****************"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="hidden md:flex w-1/2  rounded-2xl shadow-xl items-center justify-center bg-blue-100">
        <img
          src={UserLoginImg}
          alt="Admin Illustration"
          className="object-cover w-3/4 h-5/5"
        />
      </div>
    </div>
  );
};

export default UserLogHome;
