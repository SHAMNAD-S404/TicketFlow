import React, { useCallback, useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaChevronDown, FaEye } from "react-icons/fa";
import { debounce } from "lodash";
import { searchInputValidate } from "@/components/utility/searchInputValidateNameEmail";
import { ITicketContext } from "@/types/ITicketContext";
import { toast } from "react-toastify";
import { fetchAllTickets, fetchAllTicketStatics } from "@/api/services/ticketService";
import { ReassignTicket } from "./ReassignTicket";
import Pagination from "@/components/common/Pagination";
import getErrMssg from "@/components/utility/getErrMssg";
import { IoIosSearch } from "react-icons/io";
import TableStaticCards, { IStatsCardData } from "@/components/common/TableStaticCards";
import { FetchAllTicketStaticReponse } from "@/interfaces/response.interfaces";
import { IoTicketOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { RowsSkelton } from "@/components/common/RowsSkelton";

interface IAllTickets {
  handleCancel: () => void;
  handleManageTicket: () => void;
  handleSetTicketId: (value: string) => void;
}

const tableHeaders: string[] = [
  "Ticket ID",
  "Ticket Raised by",
  "Assigned Department",
  "Assigned Employee",
  "Priority",
  "Status",
  "Reassign Ticket",
  "View",
];

const AllTickets: React.FC<IAllTickets> = ({ handleCancel, handleManageTicket, handleSetTicketId }) => {
  //component states
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ticketData, setTicketData] = useState<ITicketContext[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [refreshState, setRefreshState] = useState<boolean>(false);
  const [cardLoading, setCardLoading] = useState<boolean>(true);
  const [cardStats, setCardStats] = useState<IStatsCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //pagination handle function to liftup state
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleCurrentPage = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  //handle search feature with debounce
  const handleSearchQuery = useCallback(
    debounce((searchValue: string) => {
      const validateInput = searchInputValidate(searchValue);
      if (validateInput) {
        setSearchQuery(String(searchValue));
      }
    }, 1000),

    []
  );

  //function to update ticket id and subment state
  const manageTicketHandle = (value: string) => {
    handleSetTicketId(value);
    handleManageTicket();
  };

  //ticket static card data fetch
  useEffect(() => {
    const fetchCardStats = async () => {
      try {
        const response: FetchAllTicketStaticReponse = await fetchAllTicketStatics();

        const stats: IStatsCardData[] = [
          {
            title: "Total tickets",
            value: response.data.totalTickets,
            icon: <IoTicketOutline className="text-xl" />,
          },
          {
            title: "Open tickets",
            value: response.data.openTickets,
            icon: <IoTicketOutline className="text-xl" />,
          },
          {
            title: "Closed Tickets",
            value: response.data.closedTickets,
            icon: <IoTicketOutline className="text-xl" />,
          },
          {
            title: "High Priority Tickets",
            value: response.data.highPriorityTickets,
            icon: <GoAlert className="text-xl " />,
          },
        ];
        setCardStats(stats);
        setCardLoading(false);
      } catch (_error) {
        
      }
    };

    fetchCardStats();
  }, []);

  useEffect(() => {
    const getAllTickets = async () => {
      try {
        setLoading(true);
        const response = await fetchAllTickets(currentPage, sortBy, searchQuery);
        if (response && response.data) {
          setTicketData(response.data.tickets);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        toast.error(getErrMssg(error));
      } finally {
        setLoading(false);
      }
    };
    getAllTickets();
  }, [currentPage, sortBy, searchQuery, refreshState]);

  return (
    <div className="bg-blue-50 ">
      {/* card slides */}
      <header>
        <div className="p-1">
          <TableStaticCards loading={cardLoading} data={cardStats} />
        </div>
      </header>
      {/* table section */}
      <div className="p-6  space-y-6 sm:mt-2 md:mt-6 ">
        <header className="flex justify-between mb-6">
          <section className="relative ">
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
                <option value="ticketRaisedDepartmentName">Department Raised</option>
                <option value="ticketHandlingDepartmentName">Department Handling</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>

              <FaChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400  " />
            </div>
          </section>

          <div className="text-2xl font-semibold bg-white rounded-xl px-4 py-1 shadow-xl">All Tickets Management</div>

          <section className="relative">
            <input
              type="text"
              placeholder="search by ticket, dept, employee"
              className="ms-1 pl-4 pr-10 py-2 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              onChange={(e) => handleSearchQuery(e.target.value)}
            />
            <IoIosSearch className="absolute right-3 top-2.5 w-6 h-6 text-gray-800" />
          </section>
        </header>

        {/*scrollable container*/}
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header session */}
            <div className="bg-blue-100 rounded-2xl px-6 py-6 grid grid-cols-8 gap-4 mb-4">
              {tableHeaders.map((header, index) => (
                <div key={index} className="text-sm font-semibold text-center ">
                  {header}
                </div>
              ))}
            </div>

            {/* Rows */}

            <main>
              {loading ? (
                <RowsSkelton lengthNo={5} />
              ) : ticketData.length === 0 ? (
                <div className="text-center py-4  font-semibold text-red-500 ">No Tickets were found !</div>
              ) : (
                <div className="space-y-4 ">
                  {ticketData.map((ticket, index) => (
                    <div
                      key={ticket._id || index}
                      className=" bg-white rounded-2xl px-6 py-4 grid grid-cols-8 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 ">
                      <div className="text-center">{ticket.ticketID}</div>
                      <div className=" text-center">{ticket.ticketRaisedDepartmentName}</div>
                      <div className="text-center">{ticket.ticketHandlingDepartmentName.toLowerCase()}</div>
                      <div className="text-center">
                        <a className=" text-blue-600">{ticket.ticketHandlingEmployeeName}</a>
                      </div>
                      <div className="text-center">
                        <span
                          className={`flex justify-center ms-2 items-center gap-2 ${
                            ticket.priority === "High priority"
                              ? "text-red-500 "
                              : ticket.priority === "Medium priority"
                              ? "text-orange-400"
                              : ""
                          }`}>
                          {ticket.priority}
                        </span>
                      </div>

                      <div className="flex justify-center">{ticket.status}</div>
                      {/* reassign ticket */}
                      <ReassignTicket
                        selectedDepartmentId={ticket.ticketHandlingDepartmentId}
                        selectedEmployeeId={ticket.ticketHandlingEmployeeId}
                        selectedTicketId={ticket._id}
                        twickParent={() => setRefreshState(!refreshState)}
                        handleCancel={handleCancel}
                      />

                      {/* ticket view and manage */}

                      <div className="flex justify-center">
                        <button onClick={() => manageTicketHandle(ticket._id)}>
                          <FaEye className="hover:text-blue-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
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
    </div>
  );
};

export default AllTickets;
