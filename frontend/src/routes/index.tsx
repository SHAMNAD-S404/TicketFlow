import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthRoutes from "./AuthRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import CompanyAdminRoutes from "./CompanyAdminRoutes";
import EmployeeRoutes from "./EmployeeRoutes";
import NotFound from "../pages/404";
import Unauthorized from "../pages/Unauthorized";
import ProtoctedRoutes from "./ProtectedRoutes";
import RestrictionRoute from "./RestrictionRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { userRoles } from "@/enums/userRoles";

const clientID = import.meta.env.VITE_OAUTH_CLIENT_ID;

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <RestrictionRoute>
              <LandingPage />
            </RestrictionRoute>
          }
        />

        {/* Unauthorized Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Authentication Routes */}
        <Route
          path="/auth/*"
          element={
            <GoogleOAuthProvider clientId={clientID}>
              <RestrictionRoute>
                <AuthRoutes />
              </RestrictionRoute>
            </GoogleOAuthProvider>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/sudo/*"
          element={
            <ProtoctedRoutes allowedRoles={[userRoles.Sudo]}>
              <SuperAdminRoutes />
            </ProtoctedRoutes>
          }
        />

        {/* Company Admin Routes */}
        <Route
          path="/company/*"
          element={
            <ProtoctedRoutes allowedRoles={[userRoles.Company]}>
              <CompanyAdminRoutes />
            </ProtoctedRoutes>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee/*"
          element={
            <ProtoctedRoutes allowedRoles={[userRoles.Employee]}>
              <EmployeeRoutes />
            </ProtoctedRoutes>
          }
        />

    

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
