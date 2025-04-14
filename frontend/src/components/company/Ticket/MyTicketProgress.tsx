import { fetchMyTicketProgress } from "@/api/services/ticketService";
import Pagination from "@/components/common/Pagination";
import TicketStaticsCards from "@/components/common/TicketStaticsCards";
import TicketTable from "@/components/common/TicketTable";
import getErrMssg from "@/components/utility/getErrMssg";
import { searchInputValidate } from "@/components/utility/searchInputValidateNameEmail";
import { Rootstate } from "@/redux store/store";
import { ITicketContext } from "@/types/ITicketContext";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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

  const company = useSelector((state: Rootstate) => state.company.company);

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
  const handlePrevPage = () => setCurrentPage(( prev ) => Math.max(prev - 1, 1));
  const handleCurrentPage = ( page: number ) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  //ticket Table props to lift up state and do actions
  const handleSort = (value: string) => setSortBy(value);
  const handleSearch = (query: string) => handleSearchQuery(query);

  const manageTicketHandle = (value: string) => {
    handleSetTicketId(value);
    handleViewTicketProgress();
  };

  useEffect(() => {
    const getAllTickets = async () => {
      try {
        const employeeId = company?._id as string;
        const response = await fetchMyTicketProgress(currentPage, employeeId, sortBy, searchQuery);
        if (response && response.data) {
          setTicketData(response.data.tickets);
          setTotalPages(response.data.totalPages);
        }
      } catch (error: any) {
        toast.error(getErrMssg(error))
      }
    };
    getAllTickets();
  }, [currentPage, sortBy, searchQuery]);

  return (
    <div className="bg-blue-50">
      <header>
        {/* header card slides */}

        <TicketStaticsCards />
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
