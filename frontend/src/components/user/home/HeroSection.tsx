import React, { useState, useEffect } from "react";
import SignUpModal from "../../customUI/signUpModal";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  heading: string;
  text: string;
  image: string;
  reverse?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heading, text, image, reverse = false }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { scrollYProgress } = useScroll();

  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.5], [1, 1, 0.8, 0.6]);

  useEffect(() => {
    setDisplayedText(""); // Reset before typing
  
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
  
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeNextChar, 20);
      }
    };
  
    typeNextChar(); // Start typing
  
    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [text]);

  return (
    <motion.section
      className="bg bg-gradient-to-r from-blue-50 to-blue-100 py-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>
      <div
        className={`container mx-auto px-6 md:px-12 lg:flex lg:items-center lg:gap-12 ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}>
        {/* Text section*/}
        <motion.div
          className="lg:w-1/2 w-full"
          style={{ opacity: textOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          <motion.h1
            className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight"
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, type: "spring" }}>
            {heading}
          </motion.h1>

          <motion.p
            className="mt-6 text-gray-600 phone:text-sm md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            {displayedText}
          </motion.p>

          <motion.div
            className="mt-8 flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            <motion.button
              className="bg-black text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-600 transition cursor-not-allowed"
              disabled
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}>
              Learn More
            </motion.button>
            <motion.button
              onClick={() => setShowModal(true)}
              className=" px-6 py-3 rounded-full shadow-md bg-blue-600  text-white hover:border-none"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#2563eb",
                color: "white",
                borderColor: "#2563eb",
                boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}>
              Sign Up
            </motion.button>
          </motion.div>
        </motion.div>

        {/*Right Content*/}
        <motion.div
          className="lg:w-1/2 w-full flex justify-center mt-10 lg:mt-0"
          style={{ y: imageY }}
          initial={{ opacity: 0, x: reverse ? -50 : 50, rotate: reverse ? -5 : 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            type: "spring",
            stiffness: 100,
          }}>
          <motion.img
            src={image}
            alt="hero image"
            className="max-w-full h-auto object-contain"
            whileHover={{
              scale: 1.08,
              transition: { type: "spring", stiffness: 200 },
            }}
          />
        </motion.div>
      </div>

      {/* Modal Component */}
      <SignUpModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.section>
  );
};

export default HeroSection;
