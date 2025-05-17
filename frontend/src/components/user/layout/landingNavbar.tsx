import React, { useState } from "react";
import { MdLogin, MdPersonAddAlt1 } from "react-icons/md";
import SignUpModal from "../../customUI/signUpModal";
import LoginModal from "../../customUI/LoginModal";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { navbarVariant } from "../../animations/variants";

interface LandingNavbarProps {
  featureRef: React.RefObject<HTMLDivElement>;
  aboutRef: React.RefObject<HTMLDivElement>;
  homeRef: React.RefObject<HTMLDivElement>;
}

const LandingNavbar: React.FC<LandingNavbarProps> = ({ featureRef, aboutRef, homeRef }) => {
  // State to toggle mobile menu
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  //menu selection
  const handleMenuClick = (item: string) => {
    if (item === "Features" && featureRef.current) {
      featureRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (item === "About" && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (item === "FAQ" && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (item === "Home" && homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get scroll progress
  const { scrollY } = useScroll();

  // Listen to scroll and update state
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const openLoginModal = () => setLoginModal(true);
  const closeLoginModal = () => setLoginModal(false);

  // Navbar menu list
  const navmenuList: string[] = ["Home", "Features", "FAQ", "About"];

  return (
    <motion.nav
      className={`sticky top-0 z-50 shadow-md transition-all duration-300 ${scrolled ? "bg-blue-100" : "bg-blue-200"}`}
      initial="hidden"
      animate="visible"
      variants={navbarVariant}>
      <div className="container gap-2 px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="text-2xl font-bold text-black hover:bg-gradient-to-l hover:from-purple-500 hover:via-orange-500 hover:to-yellow-500 hover:text-transparent hover:bg-clip-text transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}>
          <span className="text-blue-700 font-extrabold hover:bg-gradient-to-l hover:from-purple-500 hover:via-orange-500 hover:to-yellow-500 hover:text-transparent hover:bg-clip-text transition-all duration-300">
            Ticket
          </span>
          Flow
        </motion.div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 focus:outline-none">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex md:space-x-8 font-medium">
          {navmenuList.map((item, index) => (
            <motion.li
              key={index}
              className="relative group cursor-pointer hover:font-semibold   "
              onClick={() => handleMenuClick(item)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -2 }}>
              <span className="hover:text-blue-500 transition duration-300">{item}</span>
              <motion.span
                className="absolute left-0 bottom-[-2px] h-[2px] bg-purple-500 "
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}></motion.span>
            </motion.li>
          ))}
        </ul>

        {/* Action Buttons (Desktop Only) */}
        <div className="hidden md:flex space-x-4">
          <motion.button
            className="bg-white shadow-xl p-2 rounded-full w-28 hover:bg-gradient-to-r from-red-500 to-yellow-600 hover:text-white"
            onClick={openLoginModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}>
            <span className="font-semibold flex justify-center items-center">
              Sign In <MdLogin />
            </span>
          </motion.button>

          <motion.button
            className="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-full w-44 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500"
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}>
            <span className="font-semibold text-white flex items-center gap-1 ms-2 hover:text-black">
              Start Free Trial
              <span className="text-2xl ms-1">
                <MdPersonAddAlt1 />
              </span>
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <motion.div
        className={`md:hidden bg-white shadow-lg border-t ${isOpen ? "block" : "hidden"}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}>
        <ul className="flex flex-col space-y-4 px-6 py-4 text-gray-700 font-medium">
          {navmenuList.map((item, index) => (
            <motion.li
              key={index}
              className="cursor-pointer hover:text-blue-600 transition"
              onClick={() => handleMenuClick(item)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}>
              {item}
            </motion.li>
          ))}
        </ul>
        <div className="px-6 py-6 space-y-2 font-medium">
          <motion.button
            className="block w-full px-4 py-2 font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
            onClick={openLoginModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            Sign In
          </motion.button>
          <motion.button
            onClick={() => setShowModal(true)}
            className="block w-full px-4 py-2 font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-900 transition duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            Start Free Trial
          </motion.button>
        </div>
      </motion.div>

      {/* Modal Component */}
      <SignUpModal isOpen={showModal} onClose={() => setShowModal(false)} />
      {/* Render Login modal */}
      <LoginModal isOpen={loginModal} onClose={closeLoginModal} />
    </motion.nav>
  );
};

export default LandingNavbar;
