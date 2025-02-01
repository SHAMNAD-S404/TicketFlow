import React, { createContext ,useContext, useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import EmployeeMainContent from "../../components/employee/EmployeeMainContent";
import {fetchEmployeeData} from '../../api/services/companyService'
import { IEmployeeContext } from "../../types/IEmployeeContext";



interface IUserContext {
  user : IEmployeeContext | null ;
  refreshUser : ()=> Promise<void>;
}

//create a context for the user
const UserContext = createContext<IUserContext | null >(null);
/**
 * Custom hook to access the UserContext
 * @returns The current user context value
 */
export const useEmployeeData = () => {
  // Access the UserContext using useContext hook
  return useContext(UserContext) as IUserContext;
};


const EmployeeDashboard: React.FC = () => {
  const [user,setUser] = useState<IEmployeeContext | null>(null);
  const [role, setRole] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState("Profile");


  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

   // Function to fetch user data
   const fetchUser = async () => {
    try {
      const response = await fetchEmployeeData();
      
      setUser(response.data);
      setRole(response.data.role);

      localStorage.removeItem("currentStep");
      localStorage.removeItem("email");
    } catch (error) {
      console.log("Error while fetching employee data:", error);
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Function to refresh user data after profile update
  const refreshUser = async () => {
    await fetchUser();
  };

  if(!user )  return <div>Loading......</div>
  
  return (
    <UserContext.Provider value={{user,refreshUser}} >
      <div className="flex h-screen w-full">
        <Sidebar role={role} onMenuSelect={handleMenuSelect} />
      

        <div className="flex-1 flex flex-col w-full ">
          <DashboardHeader name={user.name} />

          <EmployeeMainContent activeMenu={activeMenu} />
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default EmployeeDashboard;
