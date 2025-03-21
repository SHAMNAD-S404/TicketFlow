import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import TicketDiscriptionCard from "./TicketDiscriptionCards";
import InputModal from "./InputModal";

interface IManageTicketUI {
  ticketData: ITicketDocument;
  ticketStatus: string;
  createdDate: string;
  currentProgress: string;
  nextTicketStatus: string;
  lastUpdatedOn: string;
  isVisible: boolean;
  isModalOpen: boolean;
  handleStatusChange: (value: string) => void;
  handleTicketStatusUpdate: () => void;
  handleModalOpen: () => void;
  submitSolution: (data: string) => void;
}

const ManageTicketUI: React.FC<IManageTicketUI> = ({
  ticketData,
  ticketStatus,
  createdDate,
  currentProgress,
  handleStatusChange,
  nextTicketStatus,
  lastUpdatedOn,
  isVisible,
  handleTicketStatusUpdate,
  isModalOpen,
  handleModalOpen,
  submitSolution,
}) => {
  const updatesStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleStatusChange(event.target.value);
  };

  return (
    <div>
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
            <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{ticketData?.ticketID}</div>
            <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{ticketData?.priority}</div>
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
                onChange={updatesStatusChange}>
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
          <InputModal isOpen={isModalOpen} onClose={handleModalOpen} submitSolution={submitSolution} />
        </div>
      </main>
    </div>
  );
};

export default ManageTicketUI;
