import React from "react";
import teamImage from "../../assets/images/signup.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariant, overlayVariant } from "../animations/variants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    onClose();
    navigate("/auth/signup");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariant}
        >
          {/* Modal Container */}
          <motion.div 
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg"
            variants={modalVariant}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.img 
                src={teamImage} 
                alt="image" 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            {/* Content */}
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h2 
                className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-l from-orange-500 via-green-500 to-blue-500 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Welcome to TicketFlow!
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-sm leading-relaxed px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Hurray! You're just a few steps away from transforming your organization's workflow. Register your company
                now and unlock a 7-day free trial of our IT Ticketing System. Seamlessly manage tickets, enhance
                collaboration, and boost productivity—experience the power of TicketFlow today!
              </motion.p>
            </motion.div>

            {/*Buttons*/}
            <motion.div 
              className="flex justify-between mt-6 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={onClose}
                className="border border-gray-400 text-gray-800 px-4 py-2 rounded-md w-1/2 mr-2 hover:bg-gray-800 hover:text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleRegisterClick}
                className="bg-purple-600 text-white px-4 py-2 rounded-md w-1/2 ml-2 hover:bg-green-700"
                whileHover={{ scale: 1.03, backgroundColor: "#16a34a" }}
                whileTap={{ scale: 0.97 }}
              >
                Register
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignUpModal;