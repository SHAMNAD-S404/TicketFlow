import { fetchOneTicket, updateTicketStatus } from "@/api/services/ticketService";
import { Messages } from "@/enums/Messages";
import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import getDate from "@/components/utility/getDate";
import { DockDemo } from "@/components/magicui/DockDemo";

interface EManageTickets {
  handleCancle: () => void;
  ticketId: string;
}

export const EManageTickets: React.FC<EManageTickets> = ({ handleCancle, ticketId }) => {
  const [ticketData, setTicketData] = useState<ITicketDocument | null>(null);
  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [currentProgress, setCurrentProgress] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const createdDate = getDate(ticketData?.createdAt as string);
  const lastUpdatedOn = getDate(ticketData?.updatedAt as string);
  const ticketStatusArr: string[] = ["pending", "in-progress", "resolved", "closed", "re-opened"];
  const currentIndex = ticketStatusArr.indexOf(ticketStatus);
  const nextTicketStatus =
    currentIndex !== -1 && currentIndex < ticketStatusArr.length - 1
      ? ticketStatusArr[currentIndex + 1]
      : ticketStatusArr[0];

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTicketStatus(event.target.value);
    setIsVisible(true);
  };

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
      if (ticketStatus === "re-opened" && currentProgress !== "closed") {
        toast.warn("only closed ticket can re-open");
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
                <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">
                  <select
                    value={ticketStatus}
                    className="text-black bg-white outline-none "
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
            <div className="flex p-4 mt-4 gap-8 ms-8">
              <div className="w-1/4 ">
                {ticketData?.imageUrl ? (
                  <img className="p-1 rounded-lg h-5/6" src={ticketData?.imageUrl} alt="ticket image" />
                ) : (
                  <div>
                    <Skeleton className="bg-gray-300 h-[350px] w-[300px] rounded-xl" />
                    <p className="ms-4 p-2">No media attached with this ticket !</p>
                  </div>
                )}
              </div>
              <div className="w-1/4">
                <label className="font-bold ms-2">Ticket Raised for</label>
                <div className="bg-gray-200 rounded-lg w-full h-3/6">
                  <textarea
                    readOnly
                    className="text-white bg-black/90 p-3 w-full h-full rounded-lg bg-gray-00 font-mono "
                    value={ticketData?.ticketReason}></textarea>
                </div>
                <div className="mt-4 ">
                  <h1 className="font-bold mt-3 bg-white rounded-lg shadow-xl p-1 ">
                    Ticket Raised Department :
                    <span className="ms-1 font-semibold text-blue-600 font-mono">
                      {ticketData?.ticketRaisedDepartmentName}
                    </span>{" "}
                  </h1>
                  <h1 className="font-bold mt-3 bg-white rounded-lg shadow-xl p-1">
                    Ticket Raised Employee :
                    <span className="ms-1 font-semibold text-blue-600 font-mono">
                      {ticketData?.ticketRaisedEmployeeName}
                    </span>{" "}
                  </h1>
                  <h1 className="font-bold mt-3 bg-white rounded-lg shadow-xl p-1">
                    Ticket last got updated on :
                    <span className="ms-1 font-semibold text-blue-600 font-mono">{lastUpdatedOn}</span>{" "}
                  </h1>
                </div>
              </div>
              <div className="w-1/4">
                <label className=" font-bold ">Ticket description :</label>
                <div className="bg-white rounded-lg w-full h-3/6">
                  <textarea
                    readOnly
                    className="text-white bg-black/90 p-3 w-full h-full rounded-lg font-mono "
                    value={ticketData?.description}></textarea>
                </div>
                <div className="mt-4  bg-white rounded-lg shadow-xl p-2 ">
                  <h1 className="font-bold mt-3">
                    Ticket Handling Department :
                    <span className="ms-1 font-semibold text-blue-600 font-mono">
                      {ticketData?.ticketHandlingDepartmentName}
                    </span>{" "}
                  </h1>
                  <h1 className="font-bold mt-3">
                    Ticket Handling Employee :
                    <span className="ms-1 font-semibold text-blue-600 font-mono">
                      {ticketData?.ticketHandlingEmployeeName}
                    </span>{" "}
                  </h1>
                  <h1 className="font-bold mt-3">
                    Additional support requested :
                    <span className="ms-1 font-semibold text-blue-600 font-mono">{ticketData?.supportType}</span>{" "}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <button
                className={`bg-blue-600  hover:bg-green-500  transition-opacity duration-300  text-white p-2 font-semibold rounded-xl w-1/5
                    ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}   `}
                onClick={handleTicketStatusUpdate}>
                Submit
              </button>
            </div>
          </main>
          <footer>

             <div className="flex flex-col items-center justify-center">
                <h2 className="text-center font-semibold">any additional features
                    <hr className="border-gray-400" />
                </h2>
               <div>
                <DockDemo/>
               </div>
             </div>

          </footer>
        </div>
      )}
    </div>
  );
};
