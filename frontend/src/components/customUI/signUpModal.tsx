import React from "react";
import teamImage from "../../assets/images/signup.png";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    onClose();
    navigate("/auth/signup");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg ">
        {/* Image */}
        <div className="flext justify-center">
          <img src={teamImage} alt="image" />
        </div>

        {/* Content */}
        <div className="text-center mt-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-l from-orange-500 via-green-500 to-blue-500 text-transparent bg-clip-text">
            Welcome to TicketFlow!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed px-2">
            Hurray! You're just a few steps away from transforming your
            organization’s workflow. Register your company now and unlock a
            7-day free trial of our IT Ticketing System. Seamlessly manage
            tickets, enhance collaboration, and boost productivity—experience
            the power of TicketFlow today!
          </p>
        </div>

        {/*Buttons*/}
        <div className="flex justify-between mt-6 font-medium">
          <button
            onClick={onClose}
            className="border border-gray-400 text-gray-800 px-4 py-2 rounded-md w-1/2 mr-2 hover:bg-gray-800 hover:text-white"
          >
            {" "}
            Cancel
          </button>
          <button
            onClick={handleRegisterClick}
            className="bg-purple-600 text-white px-4 py-2 rounded-md w-1/2 ml-2 hover:bg-green-700">
            {" "}
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
