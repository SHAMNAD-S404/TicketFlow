import React, { createContext ,useContext, useEffect, useState } from "react";
import Sidebar from "../components/dahsboard/Sidebar";
import DashboardHeader from "../components/dahsboard/DashboardHeader";
import MainContent from "../components/dahsboard/MainContent";
import {fetchUserData} from '../api/services/companyService'
import {IAdminContext} from "../types/IAdminContext"


enum UserRole {
  SuperAdmin = "superAdmin",
  CompanyAdmin = "companyAdmin",
  User = "user",
}



//create a context for the user
const UserContext = createContext<IAdminContext | null >(null);
/**
 * Custom hook to access the UserContext
 * @returns The current user context value
 */
export const useUser = () => {
  // Access the UserContext using useContext hook
  return useContext(UserContext);
};


const Dashboard: React.FC = () => {
  const [user,setUser] = useState<IAdminContext | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.CompanyAdmin);
  const [activeMenu, setActiveMenu] = useState("Dashboard");


  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

  //fetch the userdata when the componets mount
  useEffect(()=> {
      const fetchUser = async () => {
        try {
          const response = await fetchUserData();
          setUser(response.data);
          localStorage.removeItem("currentStep");
          localStorage.removeItem("email");
        } catch (error) {
          console.log("Error while fetching user data :",error);
        }
      }

      fetchUser();
  },[])

  if(!user) <div>Loading......</div>

  return (
    <UserContext.Provider value={user} >
      <div className="flex h-screen w-full">
        <Sidebar role={role} onMenuSelect={handleMenuSelect} />

        <div className="flex-1 flex flex-col w-full">
          <DashboardHeader />

          <MainContent activeMenu={activeMenu} />
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Dashboard;
