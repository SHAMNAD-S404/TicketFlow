import { fetchOneTicket, updateTicketStatus } from "@/api/services/ticketService";
import { Messages } from "@/enums/Messages";
import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import getDate from "@/components/utility/getDate";
import { DockDemo } from "@/components/magicui/DockDemo";
import InputModal from "@/components/common/InputModal";
import TicketDiscriptionCard from "@/components/common/TicketDiscriptionCards";

interface EManageTickets {
  handleCancle: () => void;
  handleChatSubMenu: () => void;
  ticketId: string;
}

export const EManageTickets: React.FC<EManageTickets> = ({ handleCancle, ticketId, handleChatSubMenu }) => {
  const [ticketData, setTicketData] = useState<ITicketDocument | null>(null);
  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [currentProgress, setCurrentProgress] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const createdDate = getDate(ticketData?.createdAt as string);
  const lastUpdatedOn = getDate(ticketData?.updatedAt as string);
  const ticketStatusArr: string[] = ["pending", "in-progress", "resolved"];
  const currentIndex = ticketStatusArr.indexOf(ticketStatus);
  const nextTicketStatus =
    currentIndex !== -1 && currentIndex < ticketStatusArr.length - 1
      ? ticketStatusArr[currentIndex + 1]
      : ticketStatusArr[2];

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTicketStatus(event.target.value);
    setIsVisible(true);
  };

  //left up state to get data from child
  const handleResolution = async (data: string) => {
    setModalOpen(false);
    try {
      const response = await updateTicketStatus(ticketData?._id as string, ticketStatus, data);
      if (response.success) {
        setCurrentProgress(ticketStatus);
        toast.success(response.message);
        setIsVisible(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.SOMETHING_TRY_AGAIN);
      }
    }
  };

  //ticket status update validation
  const handleTicketStatusUpdate = async () => {
    if (!ticketData) {
      toast.error(Messages.SELECT_REQUIRED_FIELDS);
      return;
    }

    try {
      if (!ticketStatus || ticketStatus.length < 3) {
        toast.error("select a status");
        return;
      }
      if (ticketStatus === ticketData?.status) {
        toast.error("select a different status");
        return;
      }
      if (ticketStatus === "resolved") {
        setModalOpen(true);
        return;
      }

      const response = await updateTicketStatus(ticketData._id, ticketStatus);
      if (response.success) {
        setCurrentProgress(ticketStatus);
        toast.success(response.message);
        setIsVisible(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.SOMETHING_TRY_AGAIN);
      }
    }
  };

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await fetchOneTicket(ticketId);
        if (response.success) {
          setTicketData(response.data);
          setTicketStatus(response.data.status);
          setCurrentProgress(response.data.status);
          setIsVisible(false);
          setLoading(false);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error(Messages.SOMETHING_TRY_AGAIN);
        }
        setTicketData(null);
      }
    };
    fetchTicketData();
  }, [ticketId]);

  return (
    <div>
      <div className="flex items-center justify-stretch">
        <div
          className="text-2xl w-10 bg-white p-2 rounded-2xl shadow-lg shadow-gray-400 hover:bg-blue-500 hover:text-white"
          onClick={handleCancle}>
          <IoMdArrowRoundBack />{" "}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Manage Tickets</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex mt-8 flex-col space-y-3">
              <Skeleton className="bg-gray-200 h-[275px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Header session */}
          <header>
            <div className="mt-6 px-4">
              {/* Header Row */}
              <div className="grid grid-cols-6 text-center font-semibold">
                <div>Ticket ID</div>
                <div>Priority level</div>
                <div>Ticket created date</div>
                <div>Ticket due date</div>
                <div>Current Progress</div>
                <div>Update Progress</div>
              </div>
              <hr className="border-gray-400 my-2" />

              {/* Data Row */}
              <div className="grid grid-cols-6 gap-12 text-center font-medium ">
                <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">
                  {ticketData?.ticketID}
                </div>
                <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">
                  {ticketData?.priority}
                </div>
                <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{createdDate}</div>
                <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{ticketData?.dueDate}</div>
                <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{currentProgress}</div>
                <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-green-600">
                  <select
                    value={ticketStatus}
                    disabled={ticketStatus === "resolved"}
                    className={`text-black bg-white outline-none   ${
                      ticketStatus === "resolved" ? "cursor-not-allowed " : "cursor-pointer"
                    } `}
                    onChange={handleStatusChange}>
                    <option value={ticketStatus} disabled>
                      {ticketStatus}
                    </option>
                    <option value={nextTicketStatus}>{nextTicketStatus}</option>
                  </select>
                </div>
              </div>
            </div>
          </header>

          <main>
            <div className="flex p-4 mt-4 gap-4 ms-4">
              <div className="w-1/4 mt-5">
                {ticketData?.imageUrl ? (
                  <img className="p-1 rounded-lg h-5/6" src={ticketData?.imageUrl} alt="ticket image" />
                ) : (
                  <div>
                    <Skeleton className="bg-gray-300 h-[350px] w-[300px] rounded-xl" />
                    <p className="ms-4 p-2 text-red-500">No media attached with this ticket !</p>
                  </div>
                )}
              </div>
              <div className="w-1/4">
                <h1 className="font-bold text-center">Ticket Raised for</h1>
                <div className="bg-gray-200 rounded-lg w-full h-3/6">
                  <textarea
                    readOnly
                    className="text-white bg-black/90 p-3 w-full h-full rounded-lg bg-gray-00 font-mono "
                    value={ticketData?.ticketReason}></textarea>
                </div>
                <TicketDiscriptionCard
                  caption1="Ticket Raised Department"
                  value1={ticketData?.ticketRaisedDepartmentName as string}
                  caption2="Ticket Raised Employee"
                  value2={ticketData?.ticketRaisedEmployeeName as string}
                  caption3="Ticket last got updated on"
                  value3={lastUpdatedOn}
                />
              </div>
              <div className="w-1/4">
                <h1 className=" font-bold text-center ">Ticket description :</h1>
                <div className="bg-white rounded-lg w-full h-3/6">
                  <textarea
                    readOnly
                    className="text-white bg-black/90 p-3 w-full h-full rounded-lg font-mono "
                    value={ticketData?.description}></textarea>
                </div>
                <TicketDiscriptionCard
                  caption1="Ticket Handling Department"
                  value1={ticketData?.ticketHandlingDepartmentName as string}
                  caption2="Ticket Handling Employee"
                  value2={ticketData?.ticketHandlingEmployeeName as string}
                  caption3="Additional Support Requested"
                  value3={ticketData?.supportType as string}
                />
              </div>
              {/* ticket resolution div */}
              {ticketData?.ticketResolutions && (
                <>
                  <div className="w-1/4">
                    <h1 className="font-bold text-center">Resolutions Provided :</h1>
                    <div className="bg-gray-200 rounded-lg w-full h-3/6">
                      <textarea
                        readOnly
                        className="text-white bg-black/90 p-3 w-full h-full rounded-lg bg-gray-00 font-mono "
                        value={ticketData?.ticketResolutions}></textarea>
                    </div>

                    <TicketDiscriptionCard
                      caption1="Ticket Closed Date"
                      value1={ticketData.ticketClosedDate}
                      caption2="Ticket Resolution Time"
                      value2={ticketData.resolutionTime}
                      caption3="May be the reopen come here"
                      value3="ethoke sredhikende ambanei"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center ">
              <button
                className={`bg-blue-600  hover:bg-green-500  transition-opacity duration-300  text-white p-2 font-semibold rounded-xl w-1/5
                    ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}   `}
                onClick={handleTicketStatusUpdate}>
                Submit
              </button>
            </div>
            <div>
              <InputModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} submitSolution={handleResolution} />
            </div>
          </main>
          <footer>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-center font-semibold">
                any additional support
                <hr className="border-gray-400" />
              </h2>
              <div>
                <DockDemo ticketId={ticketData?.ticketID as string} handleChat={handleChatSubMenu} />
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};
