import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import NewPassword from "../components/signIn/NewPassword";
import SuperAdminLogin from "../components/superAdmin/SuperAdminLogin";
import ResetPassword from "@/components/signIn/ResetPassword";
import NotFound from "@/pages/404";

const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<SignIn />} />
      <Route path="employee/create-new-password" element={<NewPassword userType="employee" />} />
      <Route path="forgot/reset-password" element={<ResetPassword/>}  />
      <Route path="sudo/login" element={<SuperAdminLogin />} />
      {/* Fallback Route */}
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
};

export default AuthRoutes;
