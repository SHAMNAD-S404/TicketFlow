import React from "react";
import LoginUser from "../../assets/images/userlogin.png";
import CompanyLgoin from "../../assets/images/companyLogin.png";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const handleLogin = (role:string) => {
    navigate(`/login?role=${role}`)
  }


  return (
    <div className="fixed phone:p-12 md:p-2  inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-black hover:text-red-700 hover:font-bold hover:shadow-2xl text-3xl"
        >
          {" "}
          &times;
        </button>

        <h2 className="text-3xl font-semibold text-center text-gray-800  ">
          Welcome To{" "}
          <span className="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-500  to-violet-900 bg-clip-text text-transparent">
            TicketFlow
          </span>
        </h2>
        <p className="text-center font-medium text-gray-600 mb-6">
          Select your role and continue
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div className="border border-purple-300 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-xl cursor-pointer hover:border hover:border-b-green-500 hover:border-b-4 hover:border-blue-500 hover:border-x-4 transition"
            onClick={ ()=> handleLogin("admin")} >
            <h3 className="text-2xl font-semibold text-gray-800">
              Company Admin
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Click here to login to company admin panel
            </p>
            <img
              src={CompanyLgoin}
              alt="Company Admin"
              className="w-4/5 mb-4"
            />
          </div>

          {/* User Section */}
          <div className="border border-purple-300 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:border hover:border-b-green-500 hover:border-b-4 hover:border-blue-500 hover:border-x-4 transition"
              onClick={()=> handleLogin("employee")}>
            <h3 className="text-2xl font-semibold text-gray-800">User</h3>
            <p className="text-gray-600 text-sm mb-2">
              Click here to login to user panel
            </p>
            <img src={LoginUser} alt="User" className="w-auto mb-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
