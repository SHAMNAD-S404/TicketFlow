import React from "react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  console.log(userName);
  
  return (
    <div className="bg-white shadow px-6 py-4  flex  justify-between items-center">
      <h1 className="text-lg font-bold"> Hello, {userName} </h1>
      <img
        src="https://via.placeholder.com/40"
        alt="user avatar"
        className="rounded-full w-10 h-10"
      />
    </div>
  );
};

export default DashboardHeader;
