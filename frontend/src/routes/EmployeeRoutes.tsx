import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeDashboard from "../pages/dashboards/EmployeeDashboard";
import DashHome from "@/components/employee/dashboard/DashHome";
import { TicketHome } from "@/components/employee/Ticket/TicketHome";
import ProfileUI from "@/components/employee/profileMenu/mainMenu/EmployeeProfile";
import TicketChat from "@/components/employee/chat/TicketChat";
import NotFound from "@/pages/404";

const EmployeeRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard/" element={<EmployeeDashboard />}>
        <Route path="dashboard" element={<DashHome />} />
        <Route path="tickets" element={<TicketHome />} />
        <Route path="profile" element={<ProfileUI />} />
        <Route path="chat" element={<TicketChat />} />
       
        <Route path="*" element={<NotFound/>} />
      </Route>
    </Routes>
  );
};

export default EmployeeRoutes;
