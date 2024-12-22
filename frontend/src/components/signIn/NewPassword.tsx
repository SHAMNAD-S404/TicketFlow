import React from "react";
import NewPasswordImg from "../../assets/images/setPass.png";
import Tooltips from "../utility/Tooltips";

interface NewPasswordProps {
  userType: "admin" | "user";
  loginHandler: () => void;
}

const NewPassword: React.FC<NewPasswordProps> = ({ loginHandler,userType }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-blue-50 ">
      {/* Left section */}
      <div className="md:w-1/3  bg-white m-10 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl  font-bold text-gray-800">
          Set <span className="text-blue-600">new</span> password
        </h2>
        <p className="mt-2 text-gray-600">
          Your previous password has been reset. Please set a new password for
          your account.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 ">
          <label className="flex text-start text-base  font-medium text-gray-700 mt-4  items-center gap-1">
            Set a new strong password
            <Tooltips message="Length should be from 8 to 15 . Must be contain numbers and character" />
          </label>
          <input
            type="password"
            name="password"
            placeholder="New password"
            className="w-4/5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
          />
          <label className="flex text-base font-medium text-gray-700 mt-4  items-center gap-1">
            Confirm password
            <Tooltips message="Length should be from 8 to 15 . Must be contain numbers and character" />
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            className="w-4/5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
          />
          <button
            onClick={loginHandler}
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
