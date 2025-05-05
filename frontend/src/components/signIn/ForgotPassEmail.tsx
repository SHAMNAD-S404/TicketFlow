import React, { useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const email = inputRef.current?.value;
    if (!regexPatterns.email.test(email as string)) {
      toast.error(Messages.EMAIL_INVALID);
      return;
    }

    try {
      const response = await forgotPasswordReq(email as string);
      if (response) {
        Swal.fire({
          title: "success",
          text : response.message,
          icon:"success"
        }).then(()=>navigate("/"))
        
      }
    } catch (error) {
      toast.error(getErrMssg(error))
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen bg-blue-50">
      {/* Left Side: Form */}
      <div className="bg-blue-100 rounded-lg shadow-md p-6 w-full max-w-xl h-3/4">
        <button onClick={onBacktoLogin} className="text-blue-600 hover:no-underline flex items-center mb-4">
          <span className="font-medium hover:text-purple-600 hover:font-bold flex items-center ">
            {" "}
            <IoMdArrowRoundBack /> Back to login
          </span>
        </button>
        <h2 className="text-3xl md:mt-20 font-bold text-gray-900">
          Forgot your <span className="text-blue-600 ">password?</span>
        </h2>
        <p className="mt-2 text-gray-600 font-medium ">
          Don’t worry, happens to all of us. Enter your email below to recover your password.
        </p>
        <input
          type="email"
          ref={inputRef}
          placeholder="Enter your registered email ID"
          className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleForgotPassword}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-orange-600 hover:text-black hover:font-medium transition ease-out duration-300 ">
          Submit
        </button>
      </div>

      {/* Right Side: Image */}
      <div className="hidden lg:flex md:w-1/2  items-center rounded-xl  justify-center">
        <img src={ForgotImg} alt="Forgot Password Illustration" className="w-3/4  h-3/4" />
      </div>
    </div>
  );
};

export default ForgotPassEmail;
