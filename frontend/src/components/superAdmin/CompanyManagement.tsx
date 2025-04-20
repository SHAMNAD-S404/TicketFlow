import React, { useEffect, useState, useCallback } from "react";
import { ICompanyData } from "../../types/ICompanyData";
import { fetchAllCompanies } from "../../api/services/companyService";
import { toast } from "react-toastify";
import { MdWorkspacePremium, MdOutlineEmail } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { debounce } from "lodash";
import { handleblockCompany } from "../../api/services/authService";
import { showCustomeAlert } from "../utility/swalAlertHelper";
import { FaEye, FaChevronDown } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../common/Sheet";
import { searchInputValidate } from "../utility/searchInputValidateNameEmail";
import getErrMssg from "../utility/getErrMssg";
import Pagination from "../common/Pagination";

const CompanyManagement: React.FC = () => {
  const [sort, setSortBy] = useState<string>("recent");
  const [SearchKey, setSearchKey] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [companyData, setCompanyData] = useState<ICompanyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleBlockUser = useCallback(
    debounce(
      async (email: string) => {
        try {
          const result = await showCustomeAlert({
            title: "Are you sure ",
            text: "Did you want to update the company status",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes,Confirm",
            cancelButtonText: "No,Cancel",
            reverseButtons: true,
          });
          if (result.isConfirmed) {
            const response = await handleblockCompany(email);
            if (response.success) {
              toast.success(response.message);
              //updating ui

              setCompanyData((prevCompany) =>
                prevCompany.map((company) =>
                  company.email === email ? { ...company, isBlock: !company.isBlock } : company
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

  const handleSerch = useCallback(
    debounce((searchValue: string) => {
      const validateInput = searchInputValidate(searchValue);
      if (validateInput) {
        setSearchKey(String(searchValue));
      }
    }, 1000),
    []
  );

  //pagination handle function to liftup state
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleCurrentPage = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await fetchAllCompanies(currentPage, sort, SearchKey);
        if (response && response.data) {
          setCompanyData(response.data.companies);
          setTotalPages(response.data.totalPages);
          setIsLoading(false);
        }
      } catch (error: any) {
        toast.error(getErrMssg(error))
      }
    };

    getAllCompanies();
  }, [currentPage, sort, SearchKey]);

  return (
    <div className="p-6  space-y-6 ">
      <div className="flex justify-between mb-6 items-center">
        <div className="relative ">
          <select
            className="appearance-none bg-white px-8 py-2 rounded-full  shadow-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium "
            onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Recent</option>
            <option value="companyName">Name</option>
            <option value="email">Email</option>
            <option value="companyType">Company Type</option>
            <option value="subscriptionPlan">Plan</option>
            <option value="isBlock">Status</option>
          </select>

          <FaChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400  " />
        </div>
        <div>
          <h1 className=" text-xl font-semibold" >COMPANY MANAGEMENT</h1>
        </div>
        {/* search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email"
            className="ms-1 pl-4 pr-10 py-2 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            onChange={(e) => handleSerch(e.target.value)}
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

      {/*scrollable container*/}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Header session */}
          <div className="bg-blue-100 rounded-2xl px-6 py-6 grid grid-cols-7 gap-4 mb-4">
            <div className="text-sm font-semibold">No:</div>
            <div className="text-sm font-semibold">Company name</div>
            <div className="text-sm font-semibold">Company type</div>
            <div className="text-sm font-semibold ">Email ID</div>
            <div className="text-sm font-semibold text-center">Subscription plan</div>
            <div className="text-sm font-semibold text-center">View</div>
            <div className="text-sm font-semibold text-center">Status</div>
          </div>

          {/* Rows */}
          <div className="space-y-4 ">
            {companyData.map((company, index) => (
              <div
                key={company._id || index}
                className=" bg-white rounded-2xl px-6 py-4 grid grid-cols-7 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 ">
                <div>{0 + index + 1}</div>
                <div className="flex items-center gap-3">
                  <img src={company.imageUrl} alt="" className="w-8 h-8 rounded-full" />
                  {company.companyName}
                </div>
                <div>{company.companyType}</div>
                <div>
                  <a className="underline text-blue-600">{company.email}</a>
                </div>
                <div className="text-center">
                  <span className="flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <SheetTitle className="text-center text-white text-2xl mt-8"> Company Details</SheetTitle>
                        <SheetDescription className="text-center text-sm font-thin ">
                          View company information
                        </SheetDescription>
                      </SheetHeader>

                      <div className="mt-6 flex flex-col justify-center items-center ">
                        <img src={company.imageUrl} alt="company dp" className="rounded-full w-44 h-44" />
                        <h3 className="text-xl  font-bold  mt-3">{company.companyName.toUpperCase()}</h3>
                        <p className="text-sm font-medium">{company.companyType}</p>
                        {/*  company information */}
                        <div className="mt-3 space-y-4">
                          <div>
                            <label className="text-sm font-semibold">Company corporate id :</label>
                            <p className="mt-1"> {company.corporatedId}</p>
                          </div>
                          <div>
                            <label className="text-lg font-semibold underlin">Contact Details</label>
                            <div className="flex justify-center items-center gap-2">
                              <MdOutlineEmail className="text-xl mt-1" />
                              <p className="mt-1 text-lg font-semibold text-blue-400 underline">{company.email}</p>
                            </div>
                            <p className="mt-1 text-lg font-medium">Phone : {company.phoneNumber}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold underlin">Subscription plan</label>
                            <div className="flex  items-center justify-center gap-2">
                              <MdWorkspacePremium />
                              <p className="mt-1 "> {company.subscriptionPlan}</p>
                            </div>
                          </div>
                          <div className=" flex items-center justify-center gap-2">
                            <GrMapLocation />
                            <label className="text-sm font-semibold">
                              Location - {company.originCountry.toUpperCase()}
                            </label>
                          </div>

                          <div>
                            <p className="mt-1">Joined on :{new Date(company.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="flex justify-center">
                  <button
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors text-white ${
                      company.isBlock ? "bg-lime-500 hover:bg-green-500" : " bg-orange-600  hover:bg-violet-600"
                    }   `}
                    onClick={() => handleBlockUser(company.email)}>
                    {company.isBlock ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* pagination */}
      <footer>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevPage={handlePrevPage}
          handleCurrentPage={handleCurrentPage}
          handleNextPage={handleNextPage}
        />
      </footer>
    </div>
  );
};

export default CompanyManagement;
