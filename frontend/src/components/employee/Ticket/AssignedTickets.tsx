import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { searchInputValidate } from "@/components/utility/searchInputValidateNameEmail";
import { ITicketContext } from "@/types/ITicketContext";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { fetchTicketsEmployeeWise } from "@/api/services/ticketService";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import TicketStaticsCards from "@/components/common/TicketStaticsCards";
import Pagination from "@/components/common/Pagination";
import TicketTable from "@/components/common/TicketTable";

interface IManageTickets {
  handleCancel: () => void;
  handleManageTicket: () => void;
  handleSetTicketId: (value: string) => void;
}

const AssignedTickets: React.FC<IManageTickets> = ({ handleCancel, handleManageTicket, handleSetTicketId }) => {
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tikcetData, setTicketData] = useState<ITicketContext[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

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

  //pagination handle function to liftup state
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleCurrentPage = (page: number) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  //ticket Table props to lift up state and do actions
  const handleSort = (value: string) => setSortBy(value);
  const handleSearch = (query: string) => handleSearchQuery(query);

  const manageTicketHandle = (value: string) => {
    handleSetTicketId(value);
    handleManageTicket();
  };

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
  }, [currentPage, sortBy, searchQuery]);

  return (
    <div className="bg-blue-50">
      {/* header card slides */}

      <TicketStaticsCards />

      {/* table section */}

      <div className="p-6  space-y-6 ">
        <TicketTable
          tikcetData={tikcetData}
          handleCancel={handleCancel}
          handleSearch={handleSearch}
          handleSort={handleSort}
          manageTicketHandle={manageTicketHandle}
        />

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

export default AssignedTickets;
