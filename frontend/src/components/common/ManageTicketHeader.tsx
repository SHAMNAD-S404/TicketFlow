import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React from "react";

interface IManageTicketHeader {
  ticketStatus: string;
  handleStatusChange: (value: string) => void;
  nextTicketStatus: string;
  ticketData: ITicketDocument;
  createdDate: string;
  currentProgress: string;
}

const ManageTicketHeader: React.FC<IManageTicketHeader> = ({
  ticketStatus,
  handleStatusChange,
  nextTicketStatus,
  createdDate,
  ticketData,
  currentProgress,
}) => {
  const updatesStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleStatusChange(event.target.value);
  };
  return (
    <div className="mt-6 px-4">
      {/* Header Row */}
      <div className="grid grid-cols-5 text-center font-semibold">
        <div>Ticket ID</div>
        <div>Priority level</div>
        <div>Ticket created date</div>

        <div>Current Progress</div>
        <div>Update Progress</div>
      </div>
      <hr className="border-gray-400 my-2" />

      {/* Data Row */}
      <div className="grid grid-cols-5 gap-12 text-center font-medium ">
        <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{ticketData?.ticketID}</div>
        <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{ticketData?.priority}</div>
        <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{createdDate}</div>
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
  );
};

export default ManageTicketHeader;
