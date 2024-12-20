import React from "react";
import { FaGoogle } from "react-icons/fa";
import Register from "../../assets/images/register.png";
import { Link } from "react-router-dom";

interface SignupFormProps {
  onCreateAccount : ()=> void;
}

const SignupForm: React.FC<SignupFormProps> = ({onCreateAccount}) => {
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
            Register Your Company
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Let’s get you all set up so you can start creating your company
            account.
          </p>
          {/*Form*/}
          <form className="space-y-4 ">
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter Company Name
                </label>
                <input
                  type="text"
                  placeholder=" Ticket India Ltd"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Choose company type
                </label>
                <input
                  type="text"
                  placeholder="Eg: IT Industry"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter Phone number
                </label>
                <input
                  type="tel"
                  placeholder="+91 234 567 890"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter Corporate Identification Number
                </label>
                <input
                  type="text"
                  placeholder="L01631KA2010PTC096843"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter company email
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter origin country
                </label>
                <input
                  type="text"
                  placeholder="Eg: India"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter new password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Enter confirm password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6">
              <button
                type="button"
                onClick={onCreateAccount}
                className="w-full bg-purple-600 text-white py-2 rounded-md  hover:font-bold hover:bg-gradient-to-r from-blue-500 to-green-600 font-medium transition"
              >
                Create account
              </button>
              <hr className="my-3 " />
              <h4 className="text-center">OR</h4>
              {/*Google sign up session*/}
              <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-gradient-to-r from-red-500 to-yellow-400 font-medium transition duration-300 hover:font-bold hover:text-black flex justify-center items-center gap-2 ">
                <FaGoogle />
                Signup with Google
              </button>

              <p className="text-center text-gray-600 text-sm mt-4">
                Already have an account?{" "}
                <Link
                  to="/login?role=admin"
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
