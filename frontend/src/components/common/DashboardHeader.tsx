
import React from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { FaPowerOff as FaPow } from "react-icons/fa6";

interface DashboardHeaderProps {
  name : string;
  onLogout: ()=> void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({name ,onLogout}) => {
 

  return (
    <header className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-200 border-b border-gray-200 px-6 py-2 rounded-xl w-full ">
      <div className="flex items-center justify-between ">
        {/* Left side - Greeting */}
        <div className="  ">
          <h1 className="text-xl italic font-medium  text-gray-800">
            <span className="text-blue-500">Hello,</span> {name}
          </h1>
          <p className="text-sm font-medium text-pink-400 mt-1 font-inter">
            Have a good day!
          </p>
        </div>

        {/* Middle - Search Bar */}
        <div className="flex-1 max-w-2xl mx-8    ">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full lg:w-2/3 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl shadow-xl focus:outline-none focus:ring-1 focus:ring-gray-300 hover:shadow-gray-400 transition-all duration-200 font-inter placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right side - User Profile & Notifications */}
        <div className="flex items-center space-x-10">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-3 bg-gray-100 hover:bg-white rounded-xl shadow-xl transition-colors duration-200">
              <FaBell className="h-5 w-5 text-black ease-in-out duration-300 hover:animate-bounce  hover:transition-all overflow-hidden" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full  "></span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center  bg-gray-100 rounded-xl shadow-2xl shadow-gray-600 ">
            <div className="flex flex-col items-end  ">
            </div>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-xl shadow-gray-500 "
            />
            
          </div>
          {/* logout section */}
          <div className="flex items-center  rounded-xl shadow-2xl shadow-gray-600 ">
            <div className="flex flex-col shadow-2xl shadow-gray-400 items-end  ">
            </div>
            <FaPow
              onClick={()=> onLogout()}
              className="h-9 w-9 rounded-full object-cover text-black shadow-lg shadow-gray-500 hover:shadow-blue-500   hover:shadow-xl cursor-pointer "
              />
          </div>

        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
