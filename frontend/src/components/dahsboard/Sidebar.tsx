import React from "react";
import { FaHome, FaUsers, FaCog, FaHospitalUser } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";

interface SidebarProps {
  role: string;
  onMenuSelect: (menu: string) => void;
}

const menuConfig: { [key: string]: { name: string; icon: React.ReactNode }[] } =
  {
    superAdmin: [
      { name: "Dashbord", icon: <FaHome /> },
      { name: "Client Mangement", icon: <FaUsers /> },
      { name: "Profile", icon: <FaCog /> },
    ],
    companyAdmin: [
      { name: "Dashboard", icon: <FaHome /> },
      { name: "Department Mangement", icon: <FaHospitalUser /> },
      { name: "Employee Management", icon: <FaUsers /> },
      { name: "Profile", icon: <MdOutlineAccountCircle /> },
    ],
    user: [
      { name: "dahsborad", icon: <FaHome /> },
      { name: "Profile", icon: <MdOutlineAccountCircle /> },
    ],
  };

const Sidebar: React.FC<SidebarProps> = ({ role, onMenuSelect }) => {
  const menuItems = menuConfig[role] || [];
  return (
    <div className="bg-gray-900 text-white w-64 h-screen">
      <div className="p-4 text-2xl font-bold"> TicketFlow </div>
      <p className="px-4 text-sm text-gray-400">Everything in one place</p>
      <ul className="mt-6 space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-700"
            onClick={() => onMenuSelect(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
