import React, { useCallback, useEffect, useState } from "react";
import { IoMdArrowRoundBack, IoIosSearch } from "react-icons/io";
import { FaChevronDown, FaEye } from "react-icons/fa";
import { debounce } from "lodash";
import { searchInputValidate } from "@/components/utility/searchInputValidateNameEmail";
import { ReassignTicket } from "./ReassignTicket";
import Pagination from "@/components/common/Pagination";
import { IShiftReqContext } from "@/types/IShiftReqContext";
import getErrMssg from "@/components/utility/getErrMssg";
import { toast } from "react-toastify";
import { fetchlAllShiftReq, rejectShiftRequest } from "@/api/services/ticketService";
import { MdChangeCircle } from "react-icons/md";
import { showCustomeAlert } from "@/components/utility/swalAlertHelper";
import DataShowModal from "@/components/common/DataShowModal";
import { RowsSkelton } from "@/components/common/RowsSkelton";

interface IShiftReq {
  handleCancel: () => void;
  handleManageTicket: () => void;
  handleShiftReqHome: () => void;
  handleSetTicketId: (value: string) => void;
}

const tableHeaders: string[] = [
  "Ticket ID",
  "Requested Employee",
  "Ticket Handling Department",
  "Reason",
  "Accept",
  "Reject",
  "View",
];

const ShiftReq: React.FC<IShiftReq> = ({ handleCancel, handleManageTicket, handleSetTicketId, handleShiftReqHome }) => {
  //**component state */
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshState, setRefreshState] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [tikcetData, setTicketData] = useState<IShiftReqContext[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //******* functions */

  //pagination handle function to liftup state
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleCurrentPage = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleRefresh = () => setRefreshState(!refreshState);

  //function to update ticket id and subment state
  const manageTicketHandle = (value: string) => {
    handleSetTicketId(value);
    handleShiftReqHome();
    handleManageTicket();
  };

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

  //handle reject shift req
  const hanldeRejectShiftReq = async (id: string) => {
    try {
      const result = await showCustomeAlert({
        title: "Are you sure",
        text: "Reject this request ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes,Confirm",
        cancelButtonText: "No,Cancel",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        const response = await rejectShiftRequest(id);
        if (response.success) {
          handleRefresh();
          toast.success(response.message);
        }
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    }
  };

  useEffect(() => {
    const getAllTickets = async () => {
      try {
        setLoading(true);
        const response = await fetchlAllShiftReq(currentPage, sortBy, searchQuery);
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
    <div className="bg-blue-50">
      {/* table section */}
      <h1 className=" flex items-center justify-center gap-1 text-center mt-4 text-2xl  font-bold underline underline-offset-4">
        Ticket Shift
        <MdChangeCircle className="text-3xl text-blue-500" />
        Requests
      </h1>
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
                  <option value="ticketHandlingEmployeeName">Req by employee</option>
                  <option value="ticketHandlingDepartmentName">Department Handling</option>
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
              <IoIosSearch className="absolute right-3 top-2.5 w-6 h-6 text-gray-800" />
            </div>
          </div>
        </header>
        <main>
          {/*scrollable container*/}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header session */}
              <div className="bg-blue-100 rounded-2xl px-6 py-6 grid grid-cols-7 gap-4 mb-4">
                {tableHeaders.map((header, index) => (
                  <div key={index} className="text-sm font-semibold text-center ">
                    {header}
                  </div>
                ))}
              </div>

              <section>
                {loading ? (
                  <RowsSkelton lengthNo={5} />
                ) : tikcetData.length === 0 ? (
                  <div className="text-center py-4  font-semibold text-red-500 ">No Reassign Request were found !</div>
                ) : (
                  <div className="space-y-4 ">
                    {tikcetData.map((ticket, index) => (
                      <div
                        key={ticket._id || index}
                        className=" bg-white rounded-2xl px-6 py-4 grid grid-cols-7 gap-4 items-center shadow-lg hover:shadow-xl hover:bg-gray-300  transition-transform ease-in-out duration-500 ">
                        <div className="text-center">{ticket.ticketID}</div>
                        <div className=" text-center">{ticket.ticketHandlingEmployeeName}</div>
                        <div className="text-center">{ticket.ticketHandlingDepartmentName.toLocaleUpperCase()}</div>
                        {/* view reason */}
                        <div className="text-center">
                          <button
                            className="bg-blue-500 text-white px-4 py-1 rounded-xl shadow-xl hover:bg-green-600 hover:font-semibold "
                            onClick={() => setIsModalOpen(true)}>
                            view
                          </button>
                          <DataShowModal
                            data={ticket.reason}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            heading="Ticket Shift  Reason"
                          />
                        </div>
                        {/* reassign ticket */}
                        <ReassignTicket
                          selectedDepartmentId={ticket.ticketHandlingDepartmentId}
                          selectedEmployeeId={ticket.ticketHandlingEmployeeId}
                          selectedTicketId={ticket.ticketObjectId}
                          twickParent={handleRefresh}
                          handleCancel={handleCancel}
                        />
                        {/* reject request */}
                        <div className="text-center">
                          <button
                            className="bg-blue-500 text-white text-sm px-3 py-1 rounded-xl  shadow-xl shadow-gray-300 hover:bg-red-500 "
                            onClick={() => hanldeRejectShiftReq(ticket._id)}>
                            Reject Request
                          </button>
                        </div>

                        {/* ticket view and manage */}

                        <div className="flex justify-center">
                          <button onClick={() => manageTicketHandle(ticket.ticketObjectId)}>
                            <FaEye className="hover:text-blue-600" />
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

export default ShiftReq;
