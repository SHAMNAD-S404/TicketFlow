import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthRoutes from "./AuthRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import CompanyAdminRoutes from "./CompanyAdminRoutes";

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
        <Route path="/admin/*" element={<CompanyAdminRoutes />} />

        {/* Fallback Route */}
        <Route path="*" element={<h1> 404 - Page Not Found </h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
