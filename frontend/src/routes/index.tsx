import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthRoutes from "./AuthRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import CompanyAdminRoutes from "./CompanyAdminRoutes";
import EmployeeRoutes from "./EmployeeRoutes";
import NotFound from "../pages/404";



const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Routes */}
        <Route path="/*" element={<AuthRoutes />} />

        {/* Super Admin Routes */}
        <Route path="/sudo/*" element={<SuperAdminRoutes />} />

        {/* Company Admin Routes */}
        <Route path="/company/*" element={<CompanyAdminRoutes />} />

         {/* Employee Routes */}
         <Route path="/employee/*" element={<EmployeeRoutes />} />

      

        {/* Fallback Route */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
