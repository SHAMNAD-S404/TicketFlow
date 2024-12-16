import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

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

  return (
    <footer className="bg-blue-100 text-black">
      <div className="container mx-auto px-6 py-6 lg:flex lg:justify-between lg:items-center">
        {/* Left Logo */}
        <div className="font-bold italic text-2xl ">
          Ticket
          <span className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
            Flow
          </span>
        </div>

        {/* Center- navigation Links*/}
        <ul className="flex flex-wrap justify-center space-x-6 text-sm mt-4 lg:mt-0">
          {menuItems.map((menu, index) => (
            <li key={index}>
              <a href={menu.link} className="hover:underline">
                {menu.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: social media icone session */}
        <div className="flex space-x-4 mt-4 lg:mt-0">
          <a href="#" className="hover:text-blue-500">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-blue-500">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-blue-500">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-blue-500">
            <FaLinkedinIn />
          </a>
          <a href="#" className="hover:text-blue-500">
            <FaYoutube />
          </a>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-300" />

      {/* Bottom */}
      <div className="text-center text-sm pb-4 ">
        <p>
          © 2025 TiketFlow. All rights reserved.{" "}
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="hover:underline">
            Terms of Service
          </a>{" "}
          |{" "}
          <a href="#" className="hover:underline">
            Cookies Settings
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
