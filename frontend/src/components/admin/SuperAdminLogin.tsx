import React, { useState } from "react";
import SudoLogin from "../../assets/images/sudologin.png";

const SuperAdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-hidden">
      {/* Left Section (Image) */}
      <div className="phone:flex-grow-0 md:flex-1 flex-col justify-center items-center p-6 md:p-12">
        <h1 className="text-3xl font-bold  mb-6 bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text ">
          TicketFlow
        </h1>
        <img
          src={SudoLogin}
          alt="Admin Illustration"
          className="hidden md:block w-full  object-contain"
        />
      </div>

      {/* Right Section (Form) */}
      <div className="m  md:flex-1 flex justify-center items-center bg-black bg-opacity-75 px-6 md:px-12 py-8">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            Welcome Back Admin
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Enter your credentials to login to your dashboard
          </p>

          <form>
            {/* Email Input */}
            <div className="mb-6 relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Enter Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="admin@example.com"
                className="w-full mt-1 px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Enter Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********"
                className="w-full mt-1 px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-white"
              >
                {showPassword ? "👁" : "🙈"}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-orange-600  focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
