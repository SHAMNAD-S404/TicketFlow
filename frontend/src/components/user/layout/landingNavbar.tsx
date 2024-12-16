import React, { useState } from "react";
import { MdLogin, MdPersonAddAlt1 } from "react-icons/md";

const LandingNavbar: React.FC = () => {
  
  // State to toggle mobile menu
  const [isOpen, setIsOpen] = useState(false);

  // Navbar menu list
  const navmenuList: string[] = ["Features", "Customers", "Pricing", "About"];

  return (
    <nav className="bg-blue-100 shadow-md ">
      <div className="container  gap-2  px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-black">
          <span className="text-blue-700 font-extrabold">Ticket</span>
          Flow
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 focus:outline-none"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex md:space-x-8 font-medium">
          {navmenuList.map((item, index) => (
            <li key={index} className="relative group cursor-pointer">
              <span className="hover:text-blue-500 transition duration-300">
                {item}
              </span>
              <span
                className="absolute left-0 bottom-[-2px] w-0 h-[2px] bg-purple-500 
                transition-all duration-300 group-hover:w-full"
              ></span>
            </li>
          ))}
        </ul>

        {/* Action Buttons (Desktop Only) */}
        <div className="hidden md:flex space-x-4">
          <button
            className="bg-white shadow-xl p-2 rounded-full w-28 hover:bg-gradient-to-r from-red-500 to-yellow-600 
          hover:text-white"
          >
            <span className="font-semibold flex justify-center items-center">
              Sign In <MdLogin />
            </span>
          </button>

          <button
            className="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-full w-44 
          hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500  "
          >
            <span className="font-semibold text-white  flex items-center gap-1 ms-2 hover:text-black">
              Start Free Trial
              <span className="text-2xl ms-1">
                <MdPersonAddAlt1 />
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <ul className="flex flex-col space-y-4 px-6 py-4 text-gray-700 font-medium">
            {navmenuList.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="px-6 py-6 space-y-2 font-medium">
            <button className="block w-full px-4 py-2 font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition duration-300">
              Sign In
            </button>
            <button className="block w-full px-4 py-2 font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-900 transition duration-300">
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
