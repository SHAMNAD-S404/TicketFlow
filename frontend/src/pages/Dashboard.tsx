import React, { createContext ,useContext, useEffect, useState } from "react";
import Sidebar from "../components/dahsboard/Sidebar";
import DashboardHeader from "../components/dahsboard/DashboardHeader";
import MainContent from "../components/dahsboard/MainContent";
import {fetchUserData} from '../api/services/companyService'
import {IAdminContext} from "../types/IAdminContext"
import { IEmployeeContext } from "../types/IEmployeeContext";


enum UserRole {
  SuperAdmin = "sudo",
  CompanyAdmin = "company",
  User = "employee",
}

interface IUserContext {
  user : IAdminContext | IEmployeeContext | null ;
  refreshUser : ()=> Promise<void>;
}

//create a context for the user
const UserContext = createContext<IUserContext | null >(null);
/**
 * Custom hook to access the UserContext
 * @returns The current user context value
 */
export const useUser = () => {
  // Access the UserContext using useContext hook
  return useContext(UserContext) as IUserContext;
};


const Dashboard: React.FC = () => {
  const [user,setUser] = useState<IAdminContext | IEmployeeContext | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.CompanyAdmin);
  const [activeMenu, setActiveMenu] = useState("Dashboard");


  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

   // Function to fetch user data
   const fetchUser = async () => {
    try {
      const response = await fetchUserData();
      setUser(response.data);
      setRole(response.role as UserRole);
      
      localStorage.removeItem("currentStep");
      localStorage.removeItem("email");
    } catch (error) {
      console.log("Error while fetching user data:", error);
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

  if(!user || !role )  return <div>Loading......</div>
  console.log(user);
  

  return (
    <UserContext.Provider value={{user,refreshUser}} >
      <div className="flex h-screen w-full">
        <Sidebar role={role} onMenuSelect={handleMenuSelect} />

        <div className="flex-1 flex flex-col w-full ">
          <DashboardHeader />

          <MainContent activeMenu={activeMenu} />
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Dashboard;
