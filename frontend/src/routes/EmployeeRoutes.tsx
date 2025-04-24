import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeDashboard from "../pages/dashboards/EmployeeDashboard";
import DashHome from "@/components/employee/dashboard/DashHome";
import { TicketHome } from "@/components/employee/Ticket/TicketHome";
import ProfileUI from "@/components/employee/profileMenu/mainMenu/EmployeeProfile";
import TicketChat from "@/components/employee/chat/TicketChat";
import NotFound from "@/pages/404";
import JoinVideoCallForm from "@/components/videoCall/JoinVideoCallForm";
import VideoCall from "@/components/videoCall/VideoCall";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";

const EmployeeRoutes: React.FC = () => {
  const employee = useSelector((state: Rootstate) => state.employee.employee);
  return (
    <Routes>
      <Route path="dashboard/" element={<EmployeeDashboard />}>
        <Route path="dashboard" element={<DashHome />} />
        <Route path="tickets" element={<TicketHome />} />
        <Route path="profile" element={<ProfileUI />} />
        <Route path="chat" element={<TicketChat />} />
        <Route
          path="joincall"
          element={
            <JoinVideoCallForm
              userId={String(employee?._id) || "user1"}
              userName={String(employee?.name) || "ticketFlowUser"}
              role={String(employee?.role) || "employee" } 
            />
          }
        />
        <Route path="tickets/video-call" element={<VideoCall />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default EmployeeRoutes;
