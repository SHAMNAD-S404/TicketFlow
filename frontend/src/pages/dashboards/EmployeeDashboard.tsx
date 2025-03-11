import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import EmployeeMainContent from "../../components/employee/EmployeeMainContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployee, clearUserData } from "../../redux/employeeSlice";
import { Rootstate, AppDispatch } from "../../redux/store";
import { logoutUser } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { showCustomeAlert } from "../../components/utility/swalAlertHelper";
import { toast } from "react-toastify";

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { employee, role } = useSelector((state: Rootstate) => state.employee);
  const dispatch = useDispatch<AppDispatch>();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleMenuSelect = (menu: string) => setActiveMenu(menu);


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
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        alert("error while logout");
      }
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
          />

        <EmployeeMainContent activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
