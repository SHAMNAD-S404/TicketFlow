import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../../redux store/employeeSlice";
import { Rootstate, AppDispatch } from "../../redux store/store";
import { logoutUser } from "../../api/services/authService";
import { useNavigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { showCustomeAlert } from "../../components/utility/swalAlertHelper";
import { toast } from "react-toastify";
import getErrMssg from "@/components/utility/getErrMssg";

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { employee, role } = useSelector((state: Rootstate) => state.employee);
  const dispatch = useDispatch<AppDispatch>();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
    navigate(`/employee/dashboard/${menu.toLowerCase().replace(/\s/g, "")}`);
  };

  //user logout
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

  if (!employee || !role) return <div>Loading......</div>;

  return (
    <div className="flex h-screen w-full">
      <Sidebar role={role} onMenuSelect={handleMenuSelect} />

      <div className="flex-1 flex flex-col w-full ">
        <DashboardHeader 
        name={employee.name}
          onLogout={handleLogout}
          profileImage={employee.imageUrl}
          userId={employee._id}
           />

        <div className="p-2 bg-gray-100  flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
