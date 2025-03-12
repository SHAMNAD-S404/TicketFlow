import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { debounce } from "lodash";
import { searchInputValidate } from "@/components/utility/searchInputValidateNameEmail";
import { ITicketContext } from "@/types/ITicketContext";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { fetchTicketsEmployeeWise } from "@/api/services/ticketService";
import { useSelector, UseSelector } from "react-redux";
import { Rootstate } from "@/redux/store";

interface IManageTickets {
  handleCancel: () => void;
  handleManageTicket: () => void;
  handleSetTicketId : (value:string) => void;
}

const AssignedTickets: React.FC<IManageTickets> = ({ handleCancel, handleManageTicket,handleSetTicketId }) => {
  const ticketCards = ["card 1", "card 2", "card 3", "card 4"];
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tikcetData, setTicketData] = useState<ITicketContext[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [refreshState, setRefreshState] = useState<boolean>(false);

  const employee = useSelector((state: Rootstate) => state.employee.employee);

  const handleSearchQuery = useCallback(
    debounce((searchValue: string) => {
      const validateInput = searchInputValidate(searchValue);
      if (validateInput) {
        setSearchQuery(String(searchValue));
      }
    }, 1000),

    []
  );

  const manageTicketHandle = (value : string) => {
    handleSetTicketId(value);
    handleManageTicket();
  }

  useEffect(() => {
    const getAllTickets = async () => {
      try {
        const employeeId = employee?._id as string;
        const response = await fetchTicketsEmployeeWise(currentPage, employeeId, sortBy, searchQuery);
        if (response && response.data) {
          setTicketData(response.data.tickets);
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
    getAllTickets();
  }, [currentPage, sortBy, searchQuery, refreshState]);

  return (
    <div className="bg-blue-50">
      {/* card slides */}
      <div className="flex items-center justify-evenly mt-4">
        {ticketCards.map((card, index) => (
          <Card key={index} className="w-80 bg-white border-none shadow-lg shadow-gray-400">
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription>
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-200 " />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p></p>
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
            <CardFooter>
              <p></p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* table section */}

      <div className="p-6  space-y-6 ">
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
                <option value="ticketRaisedDepartmentName">Department Raised</option>
                <option value="ticketHandlingDepartmentName">Department Handling</option>
                <option value="priority">Priority</option>
                <option value="dueData">DueDate</option>
                <option value="status">Status</option>
              </select>

              <FaChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400  " />
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="search by ticket, dept, employee"
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

        {/*scrollable container*/}
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header session */}
            <div className="bg-blue-100 rounded-2xl px-6 py-6 grid grid-cols-8 gap-4 mb-4">
              <div className="text-sm font-semibold">Ticket ID</div>
              <div className="text-sm font-semibold">Ticket Raised by</div>
              <div className="text-sm font-semibold"> Assigned Department</div>
              <div className="text-sm font-semibold ">Assigned Employee</div>
              <div className="text-sm font-semibold text-center">Priority</div>
              <div className="text-sm font-semibold text-center">Due Date</div>
              <div className="text-sm font-semibold text-center">Status</div>
              <div className="text-sm font-semibold text-center">Manage</div>
            </div>

            {/* Rows */}
            <div className="space-y-4 ">
              {tikcetData.map((ticket, index) => (
                <div
                  key={ticket._id || index}
                  className=" bg-white rounded-2xl px-6 py-4 grid grid-cols-8 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 ">
                  <div>{ticket.ticketID}</div>
                  <div className="flex items-center gap-3">{ticket.ticketRaisedDepartmentName}</div>
                  <div>{ticket.ticketHandlingDepartmentName.toLowerCase()}</div>
                  <div>
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
                  <div className="flex justify-center">{ticket.dueDate}</div>
                  <div className="flex justify-center">{ticket.status}</div>

                  {/* ticket view and manage */}
                  <div className="flex justify-center">
                  <button
                   onClick={()=>manageTicketHandle(ticket._id)}
                   >
                    <FaEye />{" "}
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
            disabled={currentPage === 1}>
            <FaChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className=" flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full ${
                  currentPage === page ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}>
                {page}
              </button>
            ))}
          </div>

          <button
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}>
            Next <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignedTickets;
