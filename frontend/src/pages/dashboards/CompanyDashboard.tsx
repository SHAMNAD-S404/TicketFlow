import React, { createContext ,useContext, useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import DashboardHeader from "../../components/common/DashboardHeader";
import MainContent from "../../components/company/CompanyMainContent";
import {fetchUserData} from '../../api/services/companyService'
import {IAdminContext} from "../../types/IAdminContext"



interface IUserContext {
  user : IAdminContext | null ;
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


const CompanyDashboard: React.FC = () => {
  const [user,setUser] = useState<IAdminContext | null>(null);
  const [role, setRole] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState("Dashboard");


  const handleMenuSelect = (menu: string) => setActiveMenu(menu);

   // Function to fetch user data
   const fetchUser = async () => {
    try {
      const response = await fetchUserData();
      
      setUser(response.data);
      setRole(response.data.role);
      

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

  if(!user )  return <div>Loading......</div>
  
  return (
    <UserContext.Provider value={{user,refreshUser}} >
      <div className="flex h-screen w-full">
        <Sidebar role={role} onMenuSelect={handleMenuSelect} />
      

        <div className="flex-1 flex flex-col w-full ">
          <DashboardHeader name={user.companyName}/>

          <MainContent activeMenu={activeMenu} />
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default CompanyDashboard;
