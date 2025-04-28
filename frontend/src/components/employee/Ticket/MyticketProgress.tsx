import { fetchMyTicketProgress, fetchMyTicketStatics } from "@/api/services/ticketService";
import Pagination from "@/components/common/Pagination";
import TableStaticCards, { IStatsCardData } from "@/components/common/TableStaticCards";
import TicketTable from "@/components/common/TicketTable";
import getErrMssg from "@/components/utility/getErrMssg";
import { searchInputValidate } from "@/components/utility/searchInputValidateNameEmail";
import { FetchAllTicketStaticReponse } from "@/interfaces/response.interfaces";
import { Rootstate } from "@/redux store/store";
import { ITicketContext } from "@/types/ITicketContext";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoTicketOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";

interface IMyTicketProgress {
  handleCancel: () => void;
  handleViewTicketProgress: () => void;
  handleSetTicketId: (value: string) => void;
}

const MyTicketProgress: React.FC<IMyTicketProgress> = ({
  handleCancel,
  handleViewTicketProgress,
  handleSetTicketId,
}) => {
  const [tikcetData, setTicketData] = useState<ITicketContext[]>([]);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [cardLoading, setCardLoading] = useState<boolean>(true);
  const [cardStats, setCardStats] = useState<IStatsCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    handleViewTicketProgress();
  };

  //ticket static card data fetch
  useEffect(() => {
    const fetchCardStats = async () => {
      try {
        setIsLoading(true);
        const response: FetchAllTicketStaticReponse = await fetchMyTicketStatics();

        const stats: IStatsCardData[] = [
          {
            title: "Raised tickets",
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
      } catch (error) {
        setIsLoading(true);
      }
    };

    fetchCardStats();
  }, []);

  useEffect(() => {
    const getAllTickets = async () => {
      try {
        const employeeId = employee?._id as string;
        const response = await fetchMyTicketProgress(currentPage, employeeId, sortBy, searchQuery);
        if (response && response.data) {
          setTicketData(response.data.tickets);
          setTotalPages(response.data.totalPages);
        }
      } catch (error: any) {
        toast.error(getErrMssg(error));
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
      {/* table section */}

      <div className="p-6  space-y-6 ">
        <TicketTable
          tikcetData={tikcetData}
          handleCancel={handleCancel}
          handleSearch={handleSearch}
          handleSort={handleSort}
          manageTicketHandle={manageTicketHandle}
          showRaisedBy={false}
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

export default MyTicketProgress;
