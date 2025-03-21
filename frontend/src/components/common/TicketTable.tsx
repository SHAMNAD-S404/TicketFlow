import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaChevronDown, FaEye } from "react-icons/fa";
import { ITicketContext } from "@/types/ITicketContext";

interface ITicketTable {
  handleCancel: () => void;
  handleSort: (value: string) => void;
  handleSearch: (query: string) => void;
  tikcetData: ITicketContext[];
  manageTicketHandle: (value: string) => void;
}

const TicketTable: React.FC<ITicketTable> = ({
  handleCancel,
  handleSort,
  handleSearch,
  tikcetData,
  manageTicketHandle,
}) => {
  return (
    <div>
      <nav>
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
                onChange={(e) => handleSort(e.target.value)}>
                <option value="createdAt">Recent</option>
                <option value="ticketRaisedDepartmentName">Department Raised</option>
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
              onChange={(e) => handleSearch(e.target.value)}
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

      {/*scrollable container*/}
      <main>
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
                    <button onClick={() => manageTicketHandle(ticket._id)}>
                      <FaEye className="hover:text-blue-500" />{" "}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketTable;
