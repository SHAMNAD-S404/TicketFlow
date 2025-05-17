import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";

type Menu = {
  link: string;
  name: string;
};

const Footer: React.FC = () => {
  const menuItems: Menu[] = [
    { link: "#", name: "About Us" },
    { link: "#", name: "Contact Us" },
    { link: "#", name: "Support Center" },
    { link: "#", name: "FAQ" },
  ];

  const socialVariants = {
    hover: (custom: number) => ({
      y: -5,
      rotate: custom,
      scale: 1.2,
      transition: { type: "spring", stiffness: 300 },
    }),
  };

  return (
    <motion.footer
      className="bg-blue-100 text-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}>
      <div className="container mx-auto px-6 py-6 lg:flex lg:justify-between lg:items-center">
        {/* Left Logo */}
        <motion.div className="font-bold italic text-2xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Ticket
          <motion.span
            className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text"
            whileHover={{
              backgroundPosition: ["0% 50%", "100% 50%"],
              transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
            }}>
            Flow
          </motion.span>
        </motion.div>

        {/* Center- navigation Links*/}
        <motion.ul
          className="flex flex-wrap justify-center space-x-6 text-sm mt-4 lg:mt-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}>
          {menuItems.map((menu, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -2 }}>
              <motion.a href={menu.link} className="relative" whileHover={{ color: "#3b82f6" }}>
                {menu.name}
                <motion.span
                  className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Right: social media icone session */}
        <motion.div
          className="flex space-x-4 mt-4 lg:mt-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}>
          {[
            { icon: <FaFacebookF />, rotate: -5 },
            { icon: <FaInstagram />, rotate: 5 },
            { icon: <FaTwitter />, rotate: -5 },
            { icon: <FaLinkedinIn />, rotate: 5 },
            { icon: <FaYoutube />, rotate: -5 },
          ].map((item, index) => (
            <motion.a
              key={index}
              href="#"
              className="text-gray-700"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover="hover"
              custom={item.rotate}>
              {item.icon}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Divider */}
      <motion.hr
        className="my-4 border-gray-300"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* Bottom */}
      <motion.div
        className="text-center text-sm pb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}>
        <p>
          © 2025 TiketFlow. All rights reserved.{" "}
          <motion.a href="#" className="relative inline-block" whileHover={{ color: "#3b82f6" }}>
            Privacy Policy
            <motion.span
              className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>{" "}
          |{" "}
          <motion.a href="#" className="relative inline-block" whileHover={{ color: "#3b82f6" }}>
            Terms of Service
            <motion.span
              className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>{" "}
          |{" "}
          <motion.a href="#" className="relative inline-block" whileHover={{ color: "#3b82f6" }}>
            Cookies Settings
            <motion.span
              className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
