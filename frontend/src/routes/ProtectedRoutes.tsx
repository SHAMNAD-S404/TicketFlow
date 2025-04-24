import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rootstate } from "../redux store/store";
import { userRoles } from "../enums/userRoles";

interface ProtoctedRoutesProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtoctedRoutes: React.FC<ProtoctedRoutesProps> = ({ allowedRoles, children }) => {
  const employeeUser = useSelector((state: Rootstate) => state.employee.employee);
  const companyUser = useSelector((state: Rootstate) => state.company.company);
  const superAdmin = useSelector((state: Rootstate) => state.sudo.sudo);

  let currentUser: any = null;
  let currentRole: string | null = null;

  if (employeeUser) {
    currentUser = employeeUser;
    currentRole = userRoles.Employee;
  } else if (companyUser) {
    currentUser = companyUser;
    currentRole = userRoles.Company;
  } else if (superAdmin) {
    currentUser = superAdmin;
    currentRole = userRoles.Sudo;
  }

  //balance will come here

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // If the logged in user's role is not allowed for this route, redirect to an unauthorized page.
  if (currentRole && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If checks pass, render the requested route.
  return children;
};

export default ProtoctedRoutes;
