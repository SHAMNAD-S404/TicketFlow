import React, { useEffect, useState } from "react";
import { ICompanyData } from "../../types/ICompanyData";
import { fetchAllCompanies } from "../../api/services/companyService";
import { toast } from "react-toastify";
import { MessageConst } from "../../utils/constants/messageConstants";
import { MdWorkspacePremium, MdOutlineEmail } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

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
} from "../common/Sheet";
import { handleblockCompany } from "../../api/services/authService";
import { Messages } from "../../enums/Messages";
import { showCustomeAlert } from "../utility/swalAlertHelper";

const tempLogo =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop";

const CompanyManagement: React.FC = () => {
  const [sort, setSortBy] = useState<string>("name");
  const [SearchKey, setSearchKey] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [companyData, setCompanyData] = useState<ICompanyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const filterData = companyData.filter(
    (company) =>
      company.companyName
        .toLocaleLowerCase()
        .includes(SearchKey.toLocaleLowerCase()) ||
      company.email.toLocaleLowerCase().includes(SearchKey.toLocaleLowerCase())
  );

  const totalPages = Math.ceil(filterData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filterData.slice(startIndex, startIndex + itemsPerPage);

  const handleBlockUser = async (email: string) => {
    try {
      const result = await showCustomeAlert({
        title: "Are you sure about it",
        text: "Did you want to update the company status",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes,Confirm",
        cancelButtonText: "No",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        const response = await handleblockCompany(email);
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.SOMETHING_TRY_AGAIN);
      }
    }
  };

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await fetchAllCompanies();
        if (response && response.data) {
          setCompanyData(response.data);
          setIsLoading(false);
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          alert(MessageConst.FETCH_ERROR_AXIOX);
        }
      }
    };

    getAllCompanies();
  }, []);

  return (
    <div className="p-6  space-y-6 ">
      <div className="flex justify-between mb-6">
        <div className="relative ">
          <select
            className="appearance-none bg-white px-8 py-2 rounded-full  shadow-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-400 "
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name A-Z </option>
            <option value="type">Type</option>
            <option value="plan">Plan</option>
          </select>

          <FaChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400  " />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="search"
            className="pl-4 pr-10 py-2 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            value={SearchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-500"
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
            <div className="text-sm font-semibold">Company name</div>
            <div className="text-sm font-semibold">Company type</div>
            <div className="text-sm font-semibold ">Email ID</div>
            <div className="text-sm font-semibold">Subscription plan</div>
            <div className="text-sm font-semibold text-center">View</div>
            <div className="text-sm font-semibold text-center">Status</div>
          </div>

          {/* Rows */}
          <div className="space-y-4 ">
            {paginatedData.map((company, index) => (
              <div
                key={company._id}
                className=" bg-white rounded-2xl px-6 py-4 grid grid-cols-7 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 "
              >
                <div>{startIndex + index + 1}</div>
                <div className="flex items-center gap-3">
                  <img src={tempLogo} alt="" className="w-8 h-8 rounded-full" />
                  {company.companyName}
                </div>
                <div>{company.companyType}</div>
                <div>
                  <a className="underline text-blue-600">{company.email}</a>
                </div>
                <div>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* {company.subscriptionPlan} */}
                    Free tier
                  </span>
                </div>
                <div className="flex justify-center">
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <FaEye className="w-5 h-5 text-gray-600" />
                      </button>
                    </SheetTrigger>
                    <SheetContent className="bg-black border-none text-center text-white ">
                      <SheetHeader>
                        <SheetTitle className="text-center mt-8">
                          {" "}
                          Company Details
                        </SheetTitle>
                        <SheetDescription className="text-center">
                          View company information
                        </SheetDescription>
                      </SheetHeader>

                      <div className="mt-6 flex flex-col justify-center items-center ">
                        <img
                          src={tempLogo}
                          alt="company dp"
                          className="rounded-full w-20 h-20"
                        />
                        <h3 className="text-lg font-bold mt-1">
                          {company.companyName.toUpperCase()}
                        </h3>
                        <p className="text-sm font-medium">
                          {company.companyType}
                        </p>
                        {/*  company information */}
                        <div className="mt-3 space-y-4">
                          <div>
                            <label className="text-sm font-semibold">
                              Company corporate id :
                            </label>
                            <p className="mt-1"> {company.corporatedId}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold underlin">
                              Contact Details
                            </label>
                            <div className="flex justify-center items-center gap-2">
                              <MdOutlineEmail />
                              <p className="mt-1 text-blue-500 underline">
                                {company.email}
                              </p>
                            </div>
                            <p className="mt-1">
                              Phone : {company.phoneNumber}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold underlin">
                              Subscription plan
                            </label>
                            <div className="flex  items-center justify-center gap-2">
                              <MdWorkspacePremium />
                              <p className="mt-1 ">
                                {" "}
                                {company.subscriptionPlan}
                              </p>
                            </div>
                          </div>
                          <div className=" flex items-center justify-center gap-2">
                            <GrMapLocation />
                            <label className="text-sm font-semibold">
                              Location - {company.originCountry.toUpperCase()}
                            </label>
                          </div>

                          <div>
                            <p className="mt-1">
                              Joined on :
                              {new Date(company.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="flex justify-center">
                  <button
                    className="px-4 py-1 text-sm font-semibold text-white bg-orange-600 rounded-full  hover:bg-violet-600 transition-colors "
                    onClick={() => handleBlockUser(company.email)}
                  >
                    {}Block
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

export default CompanyManagement;
