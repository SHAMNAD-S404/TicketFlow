import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import SAdminMainContent from "../../components/superAdmin/SuperAdminMainContent";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../../redux/sudoSlice";
import { Rootstate, AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { logoutUser } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { showCustomeAlert } from "../../components/utility/swalAlertHelper";

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  //Access Redux state
  const { sudo, role } = useSelector((state: Rootstate) => state.sudo);
  const dispatch = useDispatch<AppDispatch>();

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

  const handleLogout = async () => {
    try {
      const result = await showCustomeAlert({
        title: "Are you sure about it",
        text: "After logout you will redirect to home ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes,Confirm",
        cancelButtonText: "No,Cancel",
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

  if (!sudo || !role) return <div>Loading......</div>;

  return (
    <div className="flex h-screen w-full">
      <Sidebar role={role} onMenuSelect={handleMenuSelect} />

      <div className="flex-1 flex flex-col w-full ">
        <DashboardHeader name={"ADMIN"} 
        onLogout={handleLogout}
        profileImage="https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100205.jpg?t=st=1741444634~exp=1741448234~hmac=b187f1a3d68f5e45ce1ab6c7d130f4f8eb779b4136513619e07a28130596166d&w=826"
         />

        <SAdminMainContent activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
