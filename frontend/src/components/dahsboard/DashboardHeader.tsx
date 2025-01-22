import React from "react";
import { useUser } from "../../pages/Dashboard";



const DashboardHeader: React.FC = () => {

  //get user data from the custome hooks
  const userData = useUser();

  if(!userData) return <div>Loading.....</div>
 
  
  return (
    <div className="bg-white shadow px-6 py-4  flex  justify-between items-center">
      <h1 className="text-lg font-bold"> Hello, {userData.companyName} </h1>
      <img
        src="https://via.placeholder.com/40"
        alt="user avatar"
        className="rounded-full w-10 h-10"
      />
    </div>
  );
};

export default DashboardHeader;
