import React, { useEffect, useState } from "react";
import { FaHome, FaUsers, FaHospitalUser, FaChevronLeft } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdOutlineAccountCircle, MdOutlineVideoCall } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiDashboardFill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { TiTicket } from "react-icons/ti";

interface SidebarProps {
  role: string;
  onMenuSelect: (menu: string) => void;
  isSubscriptionExpired?: boolean;
  activeMenu: string;
}

const menuConfig: { [key: string]: { name: string; icon: React.ReactNode }[] } = {
  sudo: [
    { name: "Company Management", icon: <FaUsers /> },
    { name: "Subscription", icon: <FaHandHoldingDollar /> },
  ],
  company: [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Department Management", icon: <FaHospitalUser /> },
    { name: "Employee Management", icon: <FaUsers /> },
    { name: "Tickets", icon: <TiTicket /> },
    { name: "Subscription", icon: <FaHandHoldingDollar /> },
    { name: "Chat", icon: <IoChatbubblesOutline /> },
    { name: "Join Call", icon: <MdOutlineVideoCall /> },
    { name: "Profile", icon: <FaUserTie /> },
  ],
  employee: [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Tickets", icon: <TiTicket /> },
    { name: "Chat", icon: <IoChatbubblesOutline /> },
    { name: "Join Call", icon: <MdOutlineVideoCall /> },
    { name: "Profile", icon: <MdOutlineAccountCircle /> },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ role, onMenuSelect, isSubscriptionExpired = false, activeMenu }) => {

  console.log("subss : ",isSubscriptionExpired);
  
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const rawMenuItems = menuConfig[role] || [];
  //filer outing menu
  const menuItems =
    role === "company" && isSubscriptionExpired
      ? rawMenuItems.filter((item) => item.name === "Dashboard" || item.name === "Subscription")
      : rawMenuItems;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`relative min-h-screen bg-white border-r border-gray-200 shadow-lg rounded-2xl transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b rounded-xl border-gray-200 shadow-lg">
        {!isCollapsed && (
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Ticket
            <span className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
              Flow
            </span>
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isCollapsed ? "mx-auto" : ""}`}>
          {isCollapsed ? (
            <RiDashboardFill size={20} className="text-gray-600" />
          ) : (
            <FaChevronLeft size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Menu items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onMenuSelect(item.name)}
                className={`flex items-center space-x-3 p-4 rounded-xl w-full transition-all duration-300 shadow-xl hover:scale-105 ${
                  isCollapsed ? "justify-center" : ""
                } ${activeMenu === item.name ? "bg-black/90 text-white" : "bg-gray-100 hover:shadow-blue-200"}`}>
                <div
                  className={`text-xl transition-colors duration-300 ${
                    activeMenu === item.name ? "text-white" : "text-blue-700 hover:text-red-700"
                  }`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      activeMenu === item.name ? "text-white" : "text-black"
                    }`}>
                    {item.name}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
