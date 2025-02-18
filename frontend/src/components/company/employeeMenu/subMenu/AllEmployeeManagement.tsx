import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { debounce } from "lodash";
import { showCustomeAlert } from "../../../utility/swalAlertHelper";
import { IEmployeeContext } from "../../../../types/IEmployeeContext";
import { useSelector } from "react-redux";
import { Rootstate } from "../../../../redux/store";

import {
  FaEye,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../../common/Sheet";
import { searchInputValidate } from "../../../utility/searchInputValidateNameEmail";
import { fetchAllEmployees } from "../../../../api/services/companyService";
import { Messages } from "../../../../enums/Messages";
import { handleBlockEmployee } from "../../../../api/services/authService";

const tempLogo =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop";


interface AllEmployeeManagementProps {
  handleCancel : () => void;
}

const AllEmployeeManagement: React.FC<AllEmployeeManagementProps> = ({handleCancel}) => {
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [employeeData, setEmployeeData] = useState<IEmployeeContext[]>([]);

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
                  employee.email === email
                    ? { ...employee, isBlock: !employee.isBlock }
                    : employee
                )
              );
            }
          }
        } catch (error: any) {
          if (error.response && error.response.data) {
            toast.error(error.response.data.message);
          } else {
            toast.error(Messages.SOMETHING_TRY_AGAIN);
          }
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
        const response = await fetchAllEmployees(
          companyId,
          currentPage,
          sortBy,
          searchQuery
        );
        if (response && response.data) {
          setEmployeeData(response.data.employees);
          setTotalPages(response.data.totalPages);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error(Messages.SOMETHING_TRY_AGAIN);
        }
      }
    };

    getAllEmployees();
  }, [currentPage, sortBy, searchQuery]);
  console.log(searchQuery);

  return (
    <div className="p-6  space-y-6 ">
      <div className="flex justify-between mb-6">
        <div className="relative ">
          <div className="flex justify-center items-center gap-2">
            <div className="text-2xl bg-white p-2 rounded-2xl shadow-lg shadow-gray-400 hover:bg-blue-300"
              onClick={()=> handleCancel()}
            >
              <IoMdArrowRoundBack />{" "}
            </div>
            <select
              className="appearance-none bg-white px-8 py-2 rounded-full  shadow-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium "
              onChange={(e) => setSortBy(e.target.value)}
            >
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
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/*scrollable container*/}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Header session */}
          <div className="bg-blue-100 rounded-2xl px-6 py-6 grid grid-cols-7 gap-4 mb-4">
            <div className="text-sm font-semibold">No:</div>
            <div className="text-sm font-semibold">Employee name</div>
            <div className="text-sm font-semibold">Department</div>
            <div className="text-sm font-semibold ">Email ID</div>
            <div className="text-sm font-semibold text-center">Role</div>
            <div className="text-sm font-semibold text-center">View</div>
            <div className="text-sm font-semibold text-center">Status</div>
          </div>

          {/* Rows */}
          <div className="space-y-4 ">
            {employeeData.map((employee, index) => (
              <div
                key={employee._id || index}
                className=" bg-white rounded-2xl px-6 py-4 grid grid-cols-7 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 "
              >
                <div>{0 + index + 1}</div>
                <div className="flex items-center gap-3">
                  <img src={tempLogo} alt="" className="w-8 h-8 rounded-full" />
                  {employee.name}
                </div>
                <div>{employee.departmentName}</div>
                <div>
                  <a className="underline text-blue-600">{employee.email}</a>
                </div>
                <div className="text-center">
                  <span className="flex justify-center items-center gap-2">
                    {employee.role}
                  </span>
                </div>
                <div className="flex justify-center">
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <FaEye className="w-5 h-5 text-gray-600" />
                      </button>
                    </SheetTrigger>
                    <SheetContent className="bg-gray-600 border-none text-center text-white ">
                      <SheetHeader>
                        <SheetTitle className="text-center mt-8">
                          {" "}
                          Employee Details
                        </SheetTitle>
                        <SheetDescription className="text-center">
                          View employee information
                        </SheetDescription>
                      </SheetHeader>

                      <div className="mt-6 flex flex-col justify-center items-center ">
                        <img
                          src={tempLogo}
                          alt="company dp"
                          className="rounded-full w-20 h-20"
                        />
                        <h3 className="text-lg font-bold mt-1">
                          {employee.name.toUpperCase()}
                        </h3>
                        <p className="text-sm font-medium">
                          {employee.departmentName}
                        </p>
                        {/*  company information */}
                        <div className="mt-3 space-y-4">
                          <div>
                            <label className="text-sm font-semibold">
                              working as :
                            </label>
                            <p className="mt-1"> {employee.role}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold underlin">
                              Contact Details
                            </label>
                            <div className="flex justify-center items-center gap-2">
                              <MdOutlineEmail />
                              <p className="mt-1 text-blue-500 underline">
                                {employee.email}
                              </p>
                            </div>
                            <p className="mt-1">Phone : {employee.phone}</p>
                          </div>

                          <div>
                            <p className="mt-1">
                              Joined on :
                              {new Date(
                                employee.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="flex justify-center">
                  <button
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors text-white ${
                      employee.isBlock
                        ? "bg-lime-500 hover:bg-green-500"
                        : " bg-orange-600  hover:bg-violet-600"
                    }   `}
                    onClick={() => handleBlockUser(employee.email)}
                  >
                    {employee.isBlock ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* pagination */}

      <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-lg mt-6">
        <button
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <FaChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className=" flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full ${
                currentPage === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AllEmployeeManagement;
