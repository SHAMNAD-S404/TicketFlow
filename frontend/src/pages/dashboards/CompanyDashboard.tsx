import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import MainContent from "../../components/company/CompanyMainContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompany, clearUserData } from "../../redux/userSlice";
import { Rootstate, AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { logoutUser } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { showCustomeAlert } from "../../components/utility/swalAlertHelper";

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  //Access Redux state
  const { company, error, loading, role } = useSelector(
    (state: Rootstate) => state.company
  );
  const dispatch = useDispatch<AppDispatch>();

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

  // Fetch user data on mount
  // useEffect(() => {
  //   console.log("heloooooooooooooooo")
  //   dispatch(fetchCompany());
  // }, [dispatch]);

  const handleLogout = async () => {
    try {

      const result = await showCustomeAlert({
        title : "Are you sure about it",
        text : "After logout you will redirect to home ",
        icon : "warning",
        showCancelButton : true,
        confirmButtonText  : "Yes,Confirm",
        cancelButtonText : "No,Canel",
        reverseButtons : true

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

  if (!company || !role) return <div>Loading......</div>;

  return (
    <div className="flex h-screen w-full">
      <Sidebar role={role} onMenuSelect={handleMenuSelect} />

      <div className="flex-1 flex flex-col w-full ">
        <DashboardHeader name={company.companyName} onLogout={handleLogout} />

        <MainContent activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default CompanyDashboard;
