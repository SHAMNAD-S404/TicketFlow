import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Rootstate } from '../redux store/store';
import { userRoles } from '../enums/userRoles';
import Spinner from '../components/common/Spinner';


interface ProtoctedRoutesProps{
    children : JSX.Element;
    allowedRoles : string[];
}



const ProtoctedRoutes :React.FC<ProtoctedRoutesProps> = ({allowedRoles, children}) => {

    const employeeUser = useSelector((state:Rootstate) => state.employee.employee);
    const companyUser = useSelector((state:Rootstate) => state.company.company);
    const superAdmin = useSelector((state:Rootstate) => state.sudo.sudo)
    //balance roles come here

    let currentUser : any = null;
    let currentRole : string | null = null;

    if(employeeUser){
        currentUser = employeeUser;
        currentRole = userRoles.Employee
    }else if (companyUser){
        currentUser = companyUser;
        currentRole = userRoles.Company;
    }else if(superAdmin) {
        currentUser = superAdmin;
        currentRole = userRoles.Sudo
    }
    
    
    //balance will come here

    if(!currentUser){
        return <Navigate to="/" replace />;
    }

      // If the logged in user's role is not allowed for this route, redirect to an unauthorized page.
    if(currentRole && !allowedRoles.includes(currentRole)) {
        return <Navigate to="/unauthorized" replace />
    }

    // If checks pass, render the requested route.
    return children;

















    // const {employee ,loading : employeeLoading} = useSelector((state:Rootstate) => state.employee);
    // const {company , loading : companyLoading} = useSelector((state:Rootstate) => state.company);

    // //check for any slice is currently loading
    // const isLoading = employeeLoading || companyLoading;

    // if(isLoading){
    //     return <Spinner/>
    // }

    // let currentUser : any = null;
    // let currentRole : string | null = null;

    // if(employee){
    //     currentRole = userRoles.Employee;
    //     currentUser = employee;
    // }else if (company){
    //     currentRole = userRoles.Company;
    //     currentUser = company;
    // }

    // if(!currentUser){
    //     return <Navigate to="/" replace />
    // }

    // // If the logged-in user's role is not allowed for this route, redirect to unauthorized page.
    // if(currentRole && !allowedRoles.includes(currentRole)){
    //     return <Navigate to="/unauthorized" replace />
    // }

    // return children;


}

export default ProtoctedRoutes;