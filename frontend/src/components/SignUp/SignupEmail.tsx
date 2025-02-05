import React, { useState } from "react";
import VerifyEmail from "../../assets/images/verifyemail .png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import regexPatterns from "../../utils/regexPattern";
import { IVerifyEmail } from "../../types/auth";
import { verifyEmail } from "../../api/services/authService";
import { toast } from "react-toastify";
import GoogleSignIn from "../google/GoogleSignIn";

interface SignupFormProps {
  onVerifyEmail: () => void;
}

const Singup_Email: React.FC<SignupFormProps> = ({ onVerifyEmail }) => {
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
        toast.success(response.message, {
          onClose: () => onVerifyEmail(), //modal for otp verification
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        alert("Error creating account. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen phone:bg-white md:bg-gray-100  flex items-center justify-center px-4 ">
      {/* container */}
      <div className="bg-white  min-h-[600px] shadow-2xl my-20  phone:mt-4 rounded-xl flex  max-w-7xl w-full  overflow-hidden ">
        {/* Left section - Image */}
        <div className="hidden md:flex items-center justify-center bg-blue-100 w-1/2 ">
          <img
            src={VerifyEmail}
            alt="Signup Illustration"
            className="h-full object-contain"
          />
        </div>
        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 phone:px-8 md:px-14 py-10 bg-blue-50 lex flex-col justify-between">
          <h2 className="phone:text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center ">
            Register Your Company
          </h2>
          <hr />
          <p className="text-gray-600 text-sm mt-1 mb-4 text-center">
            Let’s get you all set up so you can start creating your company
            account.
          </p>
          <h4 className="text-center phone:text-lg md:text-xl font-semibold text-blue-600">
            Verify your email
          </h4>

          {/*Form*/}
          <form className="space-y-6 mt-4 " onSubmit={handleSubmit(formSubmit)}>
            <div className=" grid grid-cols-1 gap-2">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter company email
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: regexPatterns.email,
                      message: "Invalid email ",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md  hover:font-bold hover:bg-gradient-to-r from-blue-500 to-green-600 font-medium transition"
              >
                Verify email
              </button>
              <hr className="my-3 " />
              <h4 className="text-center">OR</h4>
              {/*Google sign up session*/}

              <GoogleSignIn />

              <p className="text-center text-gray-600 text-sm mt-4">
                Already have an account?{" "}
                <Link
                  to="/auth/login?role=admin"
                  className="text-purple-500 hover:underline font-medium hover:font-bold hover:text-blue-600 "
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Singup_Email;
