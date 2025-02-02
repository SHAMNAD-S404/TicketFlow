import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import MainContent from "../../components/company/CompanyMainContent";
import {  useDispatch, useSelector } from "react-redux";
import { fetchCompany } from "../../redux/userSlice";
import { Rootstate, AppDispatch } from "../../redux/store";

const CompanyDashboard: React.FC = () => {
  //Access Redux state
  const { company, error, loading, role } = useSelector (
    (state: Rootstate) => state.company
  );
  const dispatch = useDispatch<AppDispatch>();

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

  // Fetch user data on mount
  useEffect(() => {
    dispatch(fetchCompany());

    localStorage.removeItem("currentStep");
    localStorage.removeItem("email");
  }, [dispatch]);

  if (!company || !role) return <div>Loading......</div>;

  return (
    <div className="flex h-screen w-full">
      <Sidebar role={role} onMenuSelect={handleMenuSelect} />

      <div className="flex-1 flex flex-col w-full ">
        <DashboardHeader name={company.companyName} />

        <MainContent activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default CompanyDashboard;
