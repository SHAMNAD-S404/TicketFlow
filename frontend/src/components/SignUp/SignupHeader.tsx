import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SignupHeaderProps {
  showDescription?: boolean;
}

const SignupHeader: React.FC<SignupHeaderProps> = ({ showDescription = true }) => {
  return (
    <header className="w-full bg-blue-100 border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between phone:gap-3">
          {/* Logo and Brand Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <Link to="/">
              <h1 className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-all">
                Tiket{" "}
                <span className="bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text hover:text-green-600">
                  Flow
                </span>
              </h1>
            </Link>
          </motion.div>

          {/* Description */}
          {showDescription && (
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm text-gray-600 italic max-w-lg mt-2 md:mt-0">
              Welcome to <strong>TicketFlow</strong>.{" "}
              <span className="hidden md:inline-block text-blue-500 font-medium">
                Register to unlock the power of seamless IT ticket management.
              </span>
            </motion.p>
          )}
        </div>
      </div>
    </header>
  );
};

export default SignupHeader;
