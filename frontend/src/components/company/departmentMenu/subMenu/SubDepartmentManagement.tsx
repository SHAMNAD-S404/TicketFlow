import React, { useEffect, useState } from "react";
import { IDepartmentData } from "../../../../types/IDepartmentData";
import { toast } from "react-toastify";
import { fetchAllDepartemtsDetails } from "../../../../api/services/companyService";
import DepartmentCard from "../../../common/DepartmentCard";
import GifImage from "../../../../assets/images/black.png";
import DepartemntEmployeeManagment from "./DepartmentEmployeeManage";
import getErrMssg from "@/components/utility/getErrMssg";

export const SubDepartmentManagement: React.FC = () => {
  const [departmentData, setDepartmentData] = useState<IDepartmentData[]>([]);
  const [departmentView, setDepartmentView] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false)
  const [departmentName , setDepartmentName] = useState<string>("");

  const handleDepartmentView = (_id: string) => {
    setDepartmentView(_id);
  };

  useEffect(() => {
    const getDepartmentData = async () => {
      try {
        const response = await fetchAllDepartemtsDetails();
        setDepartmentData(response.data);
      } catch (error: any) {
        toast.error(getErrMssg(error))
      }
    };
    getDepartmentData();
  }, [refresh]);

  return (

    <div>
      {departmentView ? (
        <DepartemntEmployeeManagment
         departmentId={departmentView} 
         departmentName={departmentName}
         handleCancel ={()=> setDepartmentView(null)}
         />
      ) : (
        <div className="flex flex-wrap gap-12 justify-start p-6">
          {departmentData.map((department) => (
            <DepartmentCard
              key={department._id}
              _id={department._id}
              header={department.departmentName.toUpperCase()}
              description={department.responsibilities}
              image={GifImage}
              handleView={() => handleDepartmentView(department._id)}
              twickParent={()=> setRefresh(!refresh)}
              setDepartmentName={()=> setDepartmentName(department.departmentName)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
