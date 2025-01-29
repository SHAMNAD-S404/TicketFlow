import React from "react";
import NewPasswordImg from "../../assets/images/setPass.png";
import Tooltips from "../utility/Tooltips";
import { useForm } from "react-hook-form";
import regexPatterns, { RegexMessages } from "../../utils/regexPattern";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/services/authService";

interface NewPasswordProps {
  userType: "admin" | "employee";
  loginHandler?: () => void;
}

interface Ipassword {
  password: string;
  confirmPassword?: string;
}

const NewPassword: React.FC<NewPasswordProps> = ({
  loginHandler,
  userType,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Ipassword>();


  const navigate = useNavigate();

  const onsubmit = async (data: Ipassword) => {
    try {

        const resetEmail = localStorage.getItem("resetEmail")
        const response = await resetPassword(data.password,resetEmail as string);
        if(response.success){
          localStorage.removeItem("resetEmail")
          toast.success(response.message,{
            onClose : ()=> navigate(`/login?role=${userType}`)
          });
        }else{
          toast.error(response.message)
        }
    } catch (error : any) {
       if (error.response && error.response.data) {
              toast.error(error.response.data.message);
            } else {
              alert("Error logging in account. Please try again.");
          }
    }

     loginHandler;

    
  };

  const password = watch("password");

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-blue-50 ">
      {/* Left section */}
      <div className="md:w-1/3  bg-white m-10 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl  font-bold text-gray-800">
          Set <span className="text-blue-600">new</span> password
        </h2>
        <p className="mt-2 text-gray-600">
          Enter a new password for your account.
        </p>
        <form onSubmit={handleSubmit(onsubmit)} className="mt-6 ">
          <label className="flex text-start text-base  font-medium text-gray-700 mt-4  items-center gap-1">
            Set a new strong password
            <Tooltips message="Length should be from 8 to 15 . Must be contain numbers and character" />
          </label>
          <input
            type="password"
            placeholder="New password"
            className="w-4/5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
            {...register("password", {
              pattern: {
                value: regexPatterns.password,
                message: RegexMessages.passwordRegexMessage,
              },
              required: "password is required",
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500 font-medium">
              {errors.password.message}
            </p>
          )}
          <label className="flex text-base font-medium text-gray-700 mt-4  items-center gap-1">
            Confirm password
            <Tooltips message="Length should be from 8 to 15 . Must be contain numbers and character" />
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            className="w-4/5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
            {...register("confirmPassword", {
              required: "confirm password is required",
              validate: (value) =>
                value === password || "confirm password do not matching",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-4/5 bg-blue-600 hover:bg-green-600 hover:shadow-2xl transition duration-300 text-white py-2 rounded-lg text-lg font-medium shadow-md"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Section: Image */}
      <div className="md:w-1/2 flex justify-center items-center p-8">
        <img
          src={NewPasswordImg}
          alt="Password Reset Illustration"
          className="w-4/5 md:w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default NewPassword;
