import React, { useEffect, useState } from "react";
import { IDepartmentData } from "../../../../types/IDepartmentData";
import { toast } from "react-toastify";
import { fetchAllDepartemtsDetails } from "../../../../api/services/companyService";
import DepartmentCard from "../../../common/DepartmentCard";
import GifImage from "../../../../assets/images/black.png";
import DepartemntEmployeeManagment from "./DepartmentEmployeeManage";
import getErrMssg from "@/components/utility/getErrMssg";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export const SubDepartmentManagement: React.FC = () => {
  // component states
  const [departmentData, setDepartmentData] = useState<IDepartmentData[]>([]);
  const [departmentView, setDepartmentView] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  //pagination
  const pageLimit = 6;
  const indexOfLastDepartment = currentPage * pageLimit;
  const indexOfFirstDepartment = indexOfLastDepartment - pageLimit;
  const currentDepartments = departmentData.slice(indexOfFirstDepartment, indexOfLastDepartment);
  const totalPages = Math.ceil(departmentData.length / pageLimit);

  const handleDepartmentView = (_id: string) => {
    setDepartmentView(_id);
  };

  useEffect(() => {
    const getDepartmentData = async () => {
      try {
        const response = await fetchAllDepartemtsDetails();
        setDepartmentData(response.data);
      } catch (error) {
        toast.error(getErrMssg(error));
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
          handleCancel={() => setDepartmentView(null)}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-12 justify-start p-6">
            {currentDepartments.map((department) => (
              <>
                <DepartmentCard
                  key={department._id}
                  _id={department._id}
                  header={department.departmentName.toUpperCase()}
                  description={department.responsibilities}
                  image={GifImage}
                  handleView={() => handleDepartmentView(department._id)}
                  twickParent={() => setRefresh(!refresh)}
                  setDepartmentName={() => setDepartmentName(department.departmentName)}
                />
              </>
            ))}
          </div>
          <div className="flex items-center justify-center mt-6 space-x-3">
            {/* Previous Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                currentPage === 1
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-black hover:shadow-lg"
              }`}>
              <IoIosArrowBack />
              <span>Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg transition-all duration-200 font-medium ${
                    currentPage === i + 1
                      ? "bg-black text-white shadow-lg transform scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow"
                  }`}>
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                currentPage === totalPages
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-black hover:shadow-lg"
              }`}>
              <span>Next</span>
              <IoIosArrowForward />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
