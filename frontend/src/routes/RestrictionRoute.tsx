import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rootstate } from "../redux store/store";
import { userRoles } from "../enums/userRoles";

interface RestrictionRouteProps {
  children: JSX.Element;
  redirectionPath?: string;
}

const RestrictionRoute: React.FC<RestrictionRouteProps> = ({ children }) => {
  const employeeUser = useSelector((state: Rootstate) => state.employee.employee);
  const companyUser = useSelector((state: Rootstate) => state.company.company);

  let currentRole: string | null = null;
  if (employeeUser) currentRole = userRoles.Employee;
  else if (companyUser) currentRole = userRoles.Company;
  //balance else if come here


  // If authenticated, decide where to redirect based on role:
  if (currentRole) {
    let target = "/";

    switch (currentRole) {
      case userRoles.Company:
        target = "/company/dashboard";
        break;
      case userRoles.Employee:
        target = "/employee/dashboard";
        break;
      case userRoles.DepartmentHead:
        target = "/departmentHead/dashboard";
        break;
      case userRoles.Sudo:
        target = "/sudo/dashboard";
        break;
      default:
        target = "/";
    }

    return <Navigate to={target} replace />;
  }

  return children;
};

export default RestrictionRoute;
