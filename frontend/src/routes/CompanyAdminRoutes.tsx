import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboards/CompanyDashboard";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import ShowSubscription from "@/components/company/subscription/ShowSubscription";
import ProfileUI from "@/components/company/profileMenu/mainMenu/ProfileUI";
import { TicketHome } from "@/components/company/Ticket/TicketHome";
import EmployeeManagement from "@/components/company/employeeMenu/mainMenu/EmployeeManagement";
import DepartmentManagement from "@/components/company/departmentMenu/mainMenu/DepartmentManagement";
import DashHome from "@/components/company/dashboard/DashHome";
import PaymentCancel from "@/pages/payment/PaymentCancel";
import PurchaseHistory from "@/components/company/subscription/PurchaseHistory";
import CompanyChat from "@/components/company/chat/CompanyChat";
import JoinVideoCallForm from "@/components/videoCall/JoinVideoCallForm";
import VideoCall from "@/components/videoCall/VideoCall";
import NotFound from "@/pages/404";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";

const CompanyAdminRoutes: React.FC = () => {
  const company = useSelector((state: Rootstate) => state.company.company);
  return (
    <Routes>
      <Route path="dashboard/" element={<Dashboard />}>
        <Route path="subscription" element={<ShowSubscription />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/cancel" element={<PaymentCancel />} />
        <Route path="purchase-history" element={<PurchaseHistory />} />
        <Route path="profile" element={<ProfileUI />} />
        <Route path="tickets" element={<TicketHome />} />
        <Route path="employeemanagement" element={<EmployeeManagement />} />
        <Route path="departmentmanagement" element={<DepartmentManagement />} />
        <Route path="dashboard" element={<DashHome />} />
        <Route path="chat" element={<CompanyChat />} />
        <Route
          path="joincall"
          element={
            <JoinVideoCallForm
              userId={String(company?._id) || "user2"}
              userName={String(company?.companyName) || "ticketFlowUser1"}
              role={String(company?.role) || "company"}
            />
          }
        />
        <Route path="tickets/video-call" element={<VideoCall />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default CompanyAdminRoutes;
