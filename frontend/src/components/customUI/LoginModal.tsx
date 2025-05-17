import React from "react";
import LoginUser from "../../assets/images/userlogin.png";
import CompanyLgoin from "../../assets/images/companyLogin.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariant, overlayVariant } from "../animations/variants";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const handleLogin = (role: string) => {
    navigate(`/auth/login?role=${role}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed phone:p-12 md:p-2 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariant}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6 relative"
            variants={modalVariant}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={onClose}
              className="absolute top-3 right-4 text-black hover:text-red-700 hover:font-bold hover:shadow-2xl text-3xl"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              &times;
            </motion.button>

            <motion.h2 
              className="text-3xl font-semibold text-center text-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome To{" "}
              <span className="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-500 to-violet-900 bg-clip-text text-transparent">
                TicketFlow
              </span>
            </motion.h2>
            <motion.p 
              className="text-center font-medium text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Select your role and continue
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="border border-purple-300 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-xl cursor-pointer hover:border hover:border-b-green-500 hover:border-b-4 hover:border-blue-500 hover:border-x-4 transition"
                onClick={() => handleLogin("admin")}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.h3 
                  className="text-2xl font-semibold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Company Admin
                </motion.h3>
                <motion.p 
                  className="text-gray-600 text-sm mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Click here to login to company admin panel
                </motion.p>
                <motion.img
                  src={CompanyLgoin}
                  alt="Company Admin"
                  className="w-4/5 mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>

              {/* User Section */}
              <motion.div 
                className="border border-purple-300 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:border hover:border-b-green-500 hover:border-b-4 hover:border-blue-500 hover:border-x-4 transition"
                onClick={() => handleLogin("employee")}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.h3 
                  className="text-2xl font-semibold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  User
                </motion.h3>
                <motion.p 
                  className="text-gray-600 text-sm mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Click here to login to user panel
                </motion.p>
                <motion.img 
                  src={LoginUser} 
                  alt="User" 
                  className="w-auto mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;