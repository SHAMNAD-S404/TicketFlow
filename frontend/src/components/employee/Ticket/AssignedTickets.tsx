import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { searchInputValidate } from "@/components/utility/searchInputValidateNameEmail";
import { ITicketContext } from "@/types/ITicketContext";
import { toast } from "react-toastify";
import { fetchAssignedTicketStatics, fetchTicketsEmployeeWise } from "@/api/services/ticketService";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";
import Pagination from "@/components/common/Pagination";
import TicketTable from "@/components/common/TicketTable";
import getErrMssg from "@/components/utility/getErrMssg";
import TableStaticCards, { IStatsCardData } from "@/components/common/TableStaticCards";
import { FetchAllTicketStaticReponse } from "@/interfaces/response.interfaces";
import { IoTicketOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";

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
  const [cardLoading, setCardLoading] = useState<boolean>(true);
  const [cardStats, setCardStats] = useState<IStatsCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  //ticket static card data fetch
  useEffect(() => {
    const fetchCardStats = async () => {
      try {
        const response: FetchAllTicketStaticReponse = await fetchAssignedTicketStatics();

        const stats: IStatsCardData[] = [
          {
            title: "My tickets",
            value: response.data.totalTickets,
            icon: <IoTicketOutline className="text-xl" />,
          },
          {
            title: "Pending tickets",
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
        const employeeId = employee?._id as string;
        const response = await fetchTicketsEmployeeWise(currentPage, employeeId, sortBy, searchQuery);
        if (response && response.data) {
          setTicketData(response.data.tickets);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        toast.error(getErrMssg(error));
      } finally {
        setLoading(false)
      }
    };
    getAllTickets();
  }, [currentPage, sortBy, searchQuery]);

  return (
    <div className="bg-blue-50">
      <header className="py-6">
        {/* header card slides */}

        <TableStaticCards loading={cardLoading} data={cardStats} />
      </header>

      <div className="p-6  space-y-6 ">
        <TicketTable
          tikcetData={tikcetData}
          handleCancel={handleCancel}
          handleSearch={handleSearch}
          handleSort={handleSort}
          manageTicketHandle={manageTicketHandle}
          tableHeading="Assigned Tickets for me"
          isLoading={loading}
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
