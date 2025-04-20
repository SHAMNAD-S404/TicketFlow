import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../../redux store/userSlice";
import { Rootstate, AppDispatch } from "../../redux store/store";
import { toast } from "react-toastify";
import { logoutUser } from "../../api/services/authService";
import { useNavigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { showCustomeAlert } from "../../components/utility/swalAlertHelper";
import getErrMssg from "@/components/utility/getErrMssg";

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  //Access Redux state
  const { company, error, loading, role } = useSelector((state: Rootstate) => state.company);
  const dispatch = useDispatch<AppDispatch>();

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
    navigate(`/company/dashboard/${menu.toLowerCase().replace(/\s/g, "")}`);
  };

  const handleLogout = async () => {
    try {
      const result = await showCustomeAlert({
        title: "Are you sure about it",
        text: "After logout you will redirect to home ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes,Confirm",
        cancelButtonText: "No,Canel",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        const response = await logoutUser();
        if (response.success) {
          Swal.fire({
            text: response.message,
            icon: "success",
          }).then(() => {
            dispatch(clearUserData());
            navigate("/");
          });
        }
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
    }
  };

  //old codeee
  // if (!company || !role) return <div>Loading......</div>;

  //new code
  if (!company || !role) {
    localStorage.clear();
    return;
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar role={role} isSubscriptionExpired={company.isSubscriptionExpired}  onMenuSelect={handleMenuSelect} />

      <div className="flex-1 flex flex-col w-full ">
        <DashboardHeader name={company.companyName} onLogout={handleLogout} profileImage={company.imageUrl} />

        <div className="p-2 bg-gray-100  flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
