import React, { useEffect, useState } from "react";
import { IDepartmentData } from "../../../../types/IDepartmentData";
import { toast } from "react-toastify";
import { Messages } from "../../../../enums/Messages";
import { fetchAllDepartemtsDetails } from "../../../../api/services/companyService";
import DepartmentCard from "../../../common/DepartmentCard";
import GifImage from "../../../../assets/gif/star.gif";
import DepartemntEmployeeManagment from "./DepartmentEmployeeManage";

export const SubDepartmentManagement: React.FC = () => {
  const [departmentData, setDepartmentData] = useState<IDepartmentData[]>([]);
  const [departmentView, setDepartmentView] = useState<string | null>(null);

  const handleDepartmentView = (_id: string) => {
    setDepartmentView(_id);
  };

  useEffect(() => {
    const getDepartmentData = async () => {
      try {
        const response = await fetchAllDepartemtsDetails();
        setDepartmentData(response.data);
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error(Messages.SOMETHING_TRY_AGAIN);
        }
      }
    };
    getDepartmentData();
  }, []);

  return (

    <div>
      {departmentView ? (
        <DepartemntEmployeeManagment
         departmentId={departmentView} 
         handleCancel ={()=> setDepartmentView(null)}
         />
      ) : (
        <div className="flex flex-wrap gap-12 justify-center p-6">
          {departmentData.map((department) => (
            <DepartmentCard
              key={department._id}
              _id={department._id}
              header={department.departmentName.toUpperCase()}
              description={department.responsibilities}
              image={GifImage}
              handleView={() => handleDepartmentView(department._id)}
              
            />
          ))}
        </div>
      )}
    </div>
  );
};
