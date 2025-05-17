import React, { useState } from "react";
import SignUpModal from "../../customUI/signUpModal";
import { motion } from "framer-motion";

const TrialComponent: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <motion.section
      className="bg-blue-100 py-8 px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}>
      {/* Left Text Section */}
      <motion.div
        className="w-full lg:w-1/2 text-center"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7 },
          },
        }}>
        <motion.h2
          className="text-2xl bg-gradient-to-r from-purple-600 via-green-500 to-blue-700 bg-clip-text text-transparent
            lg:text-5xl font-bold sm:mb-4 hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500
            hover:text-transparent hoer:bg-clip-text transition duration-300"
          initial={{ backgroundPosition: "0% 50%" }}
          whileInView={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}>
          Start your free trial today
        </motion.h2>
      </motion.div>

      {/* Button Section */}
      <motion.div
        className="w-full lg:w-1/2 flex-col gap-4"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.7,
              delay: 0.2,
            },
          },
        }}>
        <motion.p
          className="phone:text-base sm:text-lg text-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}>
          Experience seamless communication between departments with our IT Ticketing System. Sign up now for a free
          7-day trial and streamline your organization's ticket management.
        </motion.p>
        <motion.div
          className="flex justify-center gap-3 py-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}>
          <motion.button
            onClick={() => setShowModal(true)}
            className="bg-black text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#2563eb",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
            whileTap={{ scale: 0.95 }}>
            Sign Up
          </motion.button>
          <motion.button
            className="bg-transparent border-2 border-black text-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition cursor-not-allowed"
            disabled
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
            whileTap={{ scale: 0.95 }}>
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modal Component */}
      <SignUpModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.section>
  );
};

export default TrialComponent;
