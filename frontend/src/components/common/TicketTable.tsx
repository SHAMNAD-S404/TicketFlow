import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaChevronDown, FaEye } from "react-icons/fa";
import { ITicketContext } from "@/types/ITicketContext";
import { IoIosSearch } from "react-icons/io";
import { RowsSkelton } from "./RowsSkelton";

interface ITicketTable {
  handleCancel: () => void;
  handleSort: (value: string) => void;
  handleSearch: (query: string) => void;
  tikcetData: ITicketContext[];
  manageTicketHandle: (value: string) => void;
  showRaisedBy?: boolean;
  tableHeading?: string;
  isLoading: boolean;
}

const TicketTable: React.FC<ITicketTable> = ({
  tableHeading = "My Ticket Progress",
  handleCancel,
  handleSort,
  handleSearch,
  tikcetData,
  manageTicketHandle,
  showRaisedBy = true,
  isLoading,
}) => {
  const gridCols = showRaisedBy ? "grid-cols-7" : "grid-cols-6";

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
                <option value="status">Status</option>
              </select>

              <FaChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400  " />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-2xl underline underline-offset-3">{tableHeading} </h1>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="search by ticket, dept, employee"
              className="ms-1 pl-4 pr-10 py-2 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              onChange={(e) => handleSearch(e.target.value)}
            />
            <IoIosSearch className="absolute right-3 top-2.5 w-6 h-6 text-gray-800" />
          </div>
        </div>
      </nav>

      {/*scrollable container*/}
      <main>
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header session */}
            <div className={` bg-blue-100 rounded-2xl px-6 py-6 grid ${gridCols} gap-4 mb-4`}>
              <div className="text-sm font-semibold">Ticket ID</div>
              {showRaisedBy && <div className="text-sm font-semibold">Ticket Raised by</div>}
              <div className="text-sm font-semibold"> Assigned Department</div>
              <div className="text-sm font-semibold ">Assigned Employee</div>
              <div className="text-sm font-semibold text-center">Priority</div>

              <div className="text-sm font-semibold text-center">Status</div>
              <div className="text-sm font-semibold text-center">Manage</div>
            </div>

            <section>
              {isLoading ? (
                <RowsSkelton lengthNo={5} />
              ) : tikcetData.length === 0 ? (
                <div className="text-center py-4  font-semibold text-red-500 ">No Tickets were found !</div>
              ) : (
                <div className="space-y-4 ">
                  {tikcetData.map((ticket, index) => (
                    <div
                      key={ticket._id || index}
                      className={`bg-white rounded-2xl px-6 py-4 grid ${gridCols} gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 `}>
                      <div>{ticket.ticketID}</div>
                      {showRaisedBy && (
                        <div className="flex items-center gap-3">{ticket.ticketRaisedDepartmentName}</div>
                      )}
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
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketTable;
