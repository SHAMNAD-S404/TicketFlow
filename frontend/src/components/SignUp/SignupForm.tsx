import React, { useState } from "react";
import Register from "../../assets/images/register.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Tooltips from "../utility/Tooltips";
import { useForm } from "react-hook-form";
import regexPatterns from "../../utils/regexPattern";
import { IsignupForm } from "../../types/auth";
import { signupUser } from "../../api/services/authService";
import { toast } from 'react-toastify';


const SignupForm: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IsignupForm>();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  //fetching stored email from local storage
  const verifiedEmail = localStorage.getItem("email")?.toString();
  const navigate = useNavigate();

  const formSubmit = async (data: IsignupForm) => {
    
    console.log("Form Data :", data);

    try {
      const response = await signupUser(data);
      if(response.success){
        toast.success(response.message );
        navigate("/auth/login?role=admin");
      }else {
        toast.error(response.message);
      }
          
    } catch (error : any) {
      if(error.response && error.response.data){
        toast.error(error.response.data.message);
      }else{
         alert("Error creating account. Please try again.");
      }
    }
  };

  //watch password for matching with confirm password
  const password = watch("password");

  return (
    <div className="min-h-screen phone:bg-white md:bg-gray-50  flex items-center justify-center px-4 ">
      {/* container */}
      <div className="bg-white   shadow-2xl my-20  phone:mt-4 rounded-xl flex  max-w-7xl w-full overflow-hidden ">
        {/* Left section - Image */}
        <div className="hidden md:flex items-center justify-center bg-blue-100 w-1/2">
          <img src={Register} alt="Signup Illustration" className="h-3/4" />
        </div>
        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 px-6 py-10 bg-blue-50 ">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center ">
           <span className="text-blue-500"> Register</span> Your Company
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Let’s get you all set up so you can start creating your company
            account.
          </p>
          {/*Form*/}
          <form className="space-y-4 " onSubmit={handleSubmit(formSubmit)}>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-semibold text-gray-600 flex gap-1 items-center ">
                  Enter Company Name
                  <Tooltips message="Only Contain Alphabates and numbers" />
                </label>

                <input
                  type="text"
                  placeholder=" Ticket India Ltd"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  {...register("companyName", {
                    required: "Company name is required",
                    pattern: {
                      value: regexPatterns.nameAndNumber,
                      message: "Only alphabets and numbers allowed",
                    },
                  })}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Choose company type
                </label>
                <select
                  className="w-full p-2 mt-1  bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 "
                  defaultValue=""
                  {...register("companyType", {
                    required: "Please select a company type",
                  })}
                >
                  <option value="" disabled>
                    Select a company type
                  </option>
                  <option value="IT Industry">IT Industry</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                </select>
                {errors.companyType && (
                  <p className="text-red-500 text-sm">
                    {errors.companyType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-1  ">
                  Enter Phone number
                  <Tooltips message="Numbers only allowed" />
                </label>
                <input
                  type="tel"
                  placeholder="+91 234 567 890"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: regexPatterns.phoneNumber,
                      message: "Only number are allowed",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {" "}
                    {errors.phoneNumber.message}{" "}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-1  ">
                  Enter Corporate Identification Number
                  <Tooltips message="Numbers and alphabates only allowed" />
                </label>
                <input
                  type="text"
                  placeholder="L01631KA2010PTC096843"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  {...register("corporatedId", {
                    required: "CIN is required",
                    pattern: {
                      value: regexPatterns.nameAndNumber,
                      message: "Only alphabated and numbers are allowed ",
                    },
                  })}
                />
                {errors.corporatedId && (
                  <p className="text-red-500 text-sm">
                    {errors.corporatedId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-green-600 font-semibold">
                  Verified  email
                </label>
                <input
                  type="email"
                  value={verifiedEmail}
                  readOnly
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-not-allowed"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: regexPatterns.email,
                      message: "Invalid email formate",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-1 ">
                  Enter origin country
                  <Tooltips message="Characters only allowed " />
                </label>
                <input
                  type="text"
                  placeholder="Eg: India"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  {...register("originCountry", {
                    required: "Origin of Country is required",
                    pattern: {
                      value: regexPatterns.name,
                      message: "Only characters are allowed",
                    },
                  })}
                />
                {errors.originCountry && (
                  <p className="text-red-500 text-sm">
                    {errors.originCountry.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-1 ">
                  Enter new password
                  <Tooltips message="Length should be from 8 to 15 . Must be contain numbers and character" />
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      maxLength: {
                        value: 15,
                        message: "Password must be no more than 15 characters",
                      },
                      pattern: {
                        value: regexPatterns.password,
                        message:
                          "Password must contain both letters and numbers",
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
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {" "}
                    {errors.password.message}{" "}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-1 ">
                  Enter confirm password
                  <Tooltips message="Length should be from 8 to 15 . Must be contain numbers and character" />
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    {...register("confirmPassword", {
                      required: "Confirm password is required ",
                      validate: (value) =>
                        value === password || "Passwords do not match",
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
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md  hover:font-bold hover:bg-gradient-to-r from-blue-500 to-green-600 font-medium transition"
              >
                Create account
              </button>
              <hr className="my-3 " />

              <p className="text-center text-gray-600 text-sm mt-4">
                Already have an account?{" "}
                <Link
                  to="/auth/login?role=admin"
                  className="text-purple-500 hover:underline font-medium hover:font-bold "
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

export default SignupForm;
