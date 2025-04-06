import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { debounce } from "lodash";
import { showCustomeAlert } from "../../../utility/swalAlertHelper";
import { IEmployeeContext } from "../../../../types/IEmployeeContext";
import { useSelector } from "react-redux";
import { Rootstate } from "../../../../redux/store";
import { searchInputValidate } from "../../../utility/searchInputValidateNameEmail";
import { fetchAllDepartemtsWiseEmployees } from "../../../../api/services/companyService";
import { handleBlockEmployee } from "../../../../api/services/authService";
import { FaEye, FaChevronDown } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../../../common/Sheet";
import getErrMssg from "@/components/utility/getErrMssg";
import Pagination from "@/components/common/Pagination";
import DeptChangeModal from "@/components/common/DeptChangeModal";

interface IDepartmentEmployee {
  departmentId: string;
  handleCancel: () => void;
}

const headerItem: string[] = [
  "No:",
  "Employee Name",
  "Email ID",
  "Role",
  "Department",
  "Change Department",
  "Status",
  "View",
];

const DepartemntEmployeeManagment: React.FC<IDepartmentEmployee> = ({ departmentId, handleCancel }) => {
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [employeeData, setEmployeeData] = useState<IEmployeeContext[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [twickParent, setTwickParent] = useState<boolean>(false);

  const company = useSelector((state: Rootstate) => state.company.company);

  const handleSearchQuery = useCallback(
    debounce((searchValue: string) => {
      const validateInput = searchInputValidate(searchValue);
      if (validateInput) {
        setSearchQuery(String(searchValue));
      }
    }, 1000),
    []
  );

  //pagination handle function to liftup state
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleCurrentPage = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  //to show dept change modal
  const handleModalOpen = (employeeId: string, departementName: string) => {
    setSelectedEmployeeId(employeeId);
    setCurrentDepartment(departementName);
    setIsModalOpen(true);
  };

  //to handle modal close functions
  const handleModalClose = () => {
    setSelectedEmployeeId("");
    setCurrentDepartment("");
    setIsModalOpen(false);
  };

  const handleBlockUser = useCallback(
    debounce(
      async (email: string) => {
        try {
          const result = await showCustomeAlert({
            title: "Are you sure ?",
            text: "Did you want to change the employee status ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes,Proced",
            cancelButtonText: "No, Cancel",
            reverseButtons: true,
          });
          if (result.isConfirmed) {
            const response = await handleBlockEmployee(email);
            if (response.success) {
              toast.success(response.message);
              //update ui
              setEmployeeData((prevData) =>
                prevData.map((employee) =>
                  employee.email === email ? { ...employee, isBlock: !employee.isBlock } : employee
                )
              );
            }
          }
        } catch (error: any) {
          toast.error(getErrMssg(error));
        }
      },
      4000,
      { leading: true, trailing: false }
    ),

    []
  );

  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const companyId = company?._id as string;
        const response = await fetchAllDepartemtsWiseEmployees(
          companyId,
          departmentId,
          currentPage,
          sortBy,
          searchQuery
        );
        if (response && response.data) {
          setEmployeeData(response.data.employees);
          setTotalPages(response.data.totalPages);
        }
      } catch (error: any) {
        toast.error(getErrMssg(error));
      }
    };

    getAllEmployees();
  }, [currentPage, sortBy, searchQuery,twickParent]);

  return (
    <div className="p-6  space-y-6 ">
      <header>
        <div className="flex justify-between mb-6">
          <div className="relative ">
            <div className="flex justify-center items-center gap-2">
              <div
                className="text-2xl bg-white p-2 rounded-2xl shadow-lg shadow-gray-400 hover:bg-blue-300"
                onClick={() => handleCancel()}>
                <IoMdArrowRoundBack />{" "}
              </div>
              <select
                className="appearance-none bg-white px-8 py-2 rounded-full  shadow-lg border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium "
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">Recent</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="departmentName">Department</option>
                <option value="role">Role</option>
                <option value="isBlock">Status</option>
              </select>

              <FaChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400  " />
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email"
              className="ms-1 pl-4 pr-10 py-2 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              onChange={(e) => handleSearchQuery(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/*scrollable container*/}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Header session */}
          <nav>
            <div className="bg-blue-100 rounded-2xl px-6 py-6 grid grid-cols-8 gap-4 mb-4">
              {headerItem.map((header, index) => (
                <>
                  <div key={index} className="text-sm font-semibold text-center ">
                    {" "}
                    {header}
                  </div>
                </>
              ))}
            </div>
          </nav>

          {/* Rows */}
          <body>
            <div className="space-y-4 ">
              {employeeData.map((employee, index) => (
                <div
                  key={employee._id || index}
                  className=" bg-white rounded-2xl px-6 py-4 grid grid-cols-8 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 ">
                  <div className="text-center">{0 + index + 1}</div>
                  <div className="flex items-center text-center gap-3">
                    <img src={employee.imageUrl} alt="" className="w-8 h-8 rounded-full" />
                    {employee.name}
                  </div>
                  <div className="text-center">
                    <a className="underline text-blue-600">{employee.email}</a>
                  </div>
                  <div className="text-center">
                    <span className="flex justify-center items-center gap-2">{employee.role}</span>
                  </div>

                  <div className="text-center">{employee.departmentName}</div>
                  <div className="text-center">
                    <button
                      onClick={() => handleModalOpen(employee._id, employee.departmentName)}
                      className="bg-blue-500 text-white rounded-xl px-2 py-1 text-sm font-semibold hover:bg-violet-600">
                      Change
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <Sheet>
                      <SheetTrigger asChild>
                        <button className="hover:bg-gray-100  p-2 rounded-full transition-colors">
                          <FaEye className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                        </button>
                      </SheetTrigger>
                      <SheetContent className="bg-black border-none text-center text-white ">
                        <SheetHeader>
                          <SheetTitle className="text-center text-white text-2xl mt-8"> Employee Details</SheetTitle>
                          <SheetDescription className="text-center text-sm text-white  font-thin">
                            View employee information
                          </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 flex flex-col justify-center items-center ">
                          <img src={employee.imageUrl} alt="company dp" className="rounded-full w-44 h-44" />
                          <h3 className="text-2xl font-semibold mt-3">{employee.name.toUpperCase()}</h3>
                          <p className="text-sm font-medium">{employee.departmentName}</p>
                          {/*  company information */}
                          <div className="mt-3 space-y-4">
                            <div>
                              <label className="text-sm font-semibold">working as :</label>
                              <p className="mt-1"> {employee.role}</p>
                            </div>
                            <div>
                              <label className="text-lg font-semibold underlin">Contact Details</label>
                              <div className="flex justify-center items-center gap-2">
                                <MdOutlineEmail className="mt-2 text-xl" />
                                <p className="mt-1 text-blue-500 underline text-lg font-semibold">{employee.email}</p>
                              </div>
                              <p className="mt-1 text-lg font-semibold">Phone : {employee.phone}</p>
                            </div>

                            <div>
                              <p className="mt-1">Joined on :{new Date(employee.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors text-white ${
                        employee.isBlock ? "bg-lime-500 hover:bg-green-500" : " bg-orange-600  hover:bg-violet-600"
                      }   `}
                      onClick={() => handleBlockUser(employee.email)}>
                      {employee.isBlock ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Modal for change department */}
            {selectedEmployeeId && (
              <DeptChangeModal
                isModalOpen={isModalOpen}
                onModalClose={handleModalClose}
                employeeId={selectedEmployeeId}
                currentDepartment={currentDepartment}
                twickParent={() => setTwickParent(!twickParent)}
              />
            )}
          </body>
        </div>
      </div>
      <footer>
        {/* pagination */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handleCurrentPage={handleCurrentPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      </footer>
    </div>
  );
};

export default DepartemntEmployeeManagment;
