import React, { useState } from "react";
import Sidebar from "../components/dahsboard/Sidebar";
import DashboardHeader from "../components/dahsboard/DashboardHeader";
import MainContent from "../components/dahsboard/MainContent";

enum UserRole {
  SuperAdmin = "superAdmin",
  CompanyAdmin = "companyAdmin",
  User = "user",
}

const Dashboard: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CompanyAdmin);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

  return (
    <div className="flex h-screen">
      <Sidebar role={role} onMenuSelect={handleMenuSelect} />

      <div className="flext-1 flex flex-col ">
        <DashboardHeader userName="sudo" />

        <MainContent activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default Dashboard;
