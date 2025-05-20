import React, { useEffect, useState, useCallback } from "react";
import { ICompanyData } from "../../types/ICompanyData";
import { fetchAllCompanies, fetchCompanySubStatics } from "../../api/services/companyService";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { FaChevronDown } from "react-icons/fa";
import { searchInputValidate } from "../utility/searchInputValidateNameEmail";
import getErrMssg from "../utility/getErrMssg";
import Pagination from "../common/Pagination";
import { isPlanExpired } from "../utility/dateFunctions.ts/isPlanExpired";
import { RowsSkelton } from "../common/RowsSkelton";
import TableStaticCards, { IStatsCardData } from "../common/TableStaticCards";
import { fetchSubscriptionStatics } from "@/api/services/subscriptionService";


const heading: string[] = [
  "NO:",
  "Company name",
  "Company type",
  "Email ID",
  "Subscription plan",
  "Subscription ends on",
  "Status",
];

const SubscriptionManagement: React.FC = () => {
  const [sort, setSortBy] = useState<string>("recent");
  const [SearchKey, setSearchKey] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [companyData, setCompanyData] = useState<ICompanyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cardStats, setCardStats] = useState<IStatsCardData[]>([]);
  const [cardLoading, setCardLoading] = useState<boolean>(true);

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
    const fetchCardStats = async () => {
      try {
        setIsLoading(true);
        const [res1, res2] = await Promise.all([fetchSubscriptionStatics(), fetchCompanySubStatics()]);

        const stats: IStatsCardData[] = [
          {
            title: "Total Orders",
            value: res1.data.totalOrders,
          },
          {
            title: "Total Revenue",
            value: res1.data.totalRevenue,
          },
          {
            title: "Plan Active Users",
            value: res2.data.activeUserCount,
          },
          {
            title: "Avilable Plans",
            value: "3",
          },
        ];
        setCardStats(stats);
        setCardLoading(false);
      } catch (_error) {
        setIsLoading(true);
      }
    };

    fetchCardStats();
  }, []);

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await fetchAllCompanies(currentPage, sort, SearchKey);
        if (response && response.data) {
          setCompanyData(response.data.companies);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        toast.error(getErrMssg(error));
      } finally {
        setIsLoading(false);
      }
    };

    getAllCompanies();
  }, [currentPage, sort, SearchKey]);

  return (
    <>
      <div className="p-6  space-y-6 ">
        <header>
          <div>
            <TableStaticCards loading={cardLoading} data={cardStats} />
          </div>
        </header>
        <nav>
          <div className="flex justify-between mb-6 items-center">
            <div className="relative mt-4 ">
              <select
                className="appearance-none bg-white px-8 py-2 rounded-full  shadow-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium "
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">Recent</option>
                <option value="companyName">Name</option>
                <option value="email">Email</option>
                <option value="companyType">Company Type</option>
                <option value="subscriptionPlan">Plan</option>
              </select>

              <FaChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400  " />
            </div>
            <div>
              <h1 className=" text-xl font-semibold">SUBSCRIPTION MANAGEMENT</h1>
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
        </nav>

        <main>
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header session */}
              <div className="bg-blue-100 rounded-2xl px-6 py-6 grid grid-cols-7 gap-4 mb-4">
                {heading.map((heading, index) => (
                  <div key={index} className="text-sm font-semibold text-center">
                    {heading}
                  </div>
                ))}
              </div>
              {/* Rows */}
              <div className="space-y-4 ">
                {isLoading ? (
                  <RowsSkelton lengthNo={4} />
                ) : (
                  <>
                    {companyData.map((company, index) => (
                      <div
                        key={company._id || index}
                        className=" bg-white text-center rounded-2xl px-6 py-4 grid grid-cols-7 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 ">
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
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              color="green"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {company.subscriptionPlan}
                          </span>
                        </div>

                        <div className="text-center">{company.subscriptionEndDate}</div>
                        <div className="flex justify-center">
                          {isPlanExpired(company.subscriptionEndDate) ? (
                            <h1 className="text-white bg-red-600 px-3 text-sm font-semibold py-1 shadow-xl rounded-full">
                              Expired
                            </h1>
                          ) : (
                            <h1 className="text-white bg-green-600 shadow-xl px-3 text-sm font-semibold py-1  rounded-full">
                              Active
                            </h1>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {/*scrollable container*/}

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
    </>
  );
};

export default SubscriptionManagement;
