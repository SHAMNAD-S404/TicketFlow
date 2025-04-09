import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React, { useState } from "react";
import InputModal from "./InputModal";
import { toast } from "react-toastify";
import getErrMssg from "../utility/getErrMssg";
import { ticketShiftRequest } from "@/api/services/ticketService";

interface IManageTicketHeader {
  ticketStatus: string;
  handleStatusChange: (value: string) => void;
  nextTicketStatus: string;
  ticketData: ITicketDocument;
  createdDate: string;
  currentProgress: string;
  enableShiftReq?: boolean;
}

export interface IPayloadShiftReq {
  ticketObjectId: string;
  ticketID: string;
  ticketHandlingEmployeeName: string;
  ticketHandlingEmployeeId: string;
  ticketHandlingDepartmentName: string;
  ticketHandlingDepartmentId: string;
  reason: string;
}

const ManageTicketHeader: React.FC<IManageTicketHeader> = ({
  ticketStatus,
  handleStatusChange,
  nextTicketStatus,
  createdDate,
  ticketData,
  currentProgress,
  enableShiftReq,
}) => {
  //**********************component states*************
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRequested, setIsRequested] = useState<boolean>(false);

  const updatesStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleStatusChange(event.target.value);
  };

  //*********************functions*********************
  //fn to handle modal open
  const handleModalOpen = () => setIsModalOpen(false);

  //fn to submit ticket shift req
  const submitSolution = async (data: string) => {
    const payload: IPayloadShiftReq = {
      ticketObjectId: ticketData._id,
      ticketID: ticketData.ticketID,
      ticketHandlingEmployeeName: ticketData.ticketHandlingEmployeeName,
      ticketHandlingEmployeeId: ticketData.ticketHandlingEmployeeId,
      ticketHandlingDepartmentName: ticketData.ticketHandlingDepartmentName,
      ticketHandlingDepartmentId: ticketData.ticketHandlingDepartmentId,
      reason: data,
    };

    try {
      const response = await ticketShiftRequest(payload);
      if (response.success) {
        setIsRequested(true);
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
    } finally {
      handleModalOpen(); //handle modal open
    }
  };

  //handling show ticket shift request dynamically
  const shiftRequestShow: boolean = ticketStatus !== "resolved";
  const gridCount = shiftRequestShow && enableShiftReq ? "grid-cols-6" : "grid-cols-5";

  return (
    <div className="mt-6 px-4">
      {/* Header Row */}
      <div className={`grid ${gridCount} text-center font-semibold`}>
        <div>Ticket ID</div>
        <div>Priority level</div>
        <div>Ticket created date</div>
        <div>Current Progress</div>
        <div>Update Progress</div>
        {shiftRequestShow && enableShiftReq && <div>Ticket Shift Request</div>}
      </div>
      <hr className="border-gray-400 my-2" />

      {/* Data Row */}
      <div className={`grid ${gridCount} gap-12 text-center font-medium `}>
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
        {shiftRequestShow && enableShiftReq && (
          <div
            className={`rounded-2xl bg-black text-white font-semibold p-2 shadow-xl shadow-gray-400 ${
              isRequested ? "hover:bg-black" : "hover:bg-blue-500"
            }`}>
            <button
              className={` w-full h-full  ${isRequested ? "cursor-not-allowed" : "cursor-pointer"}  `}
              onClick={() => setIsModalOpen(true)}
              disabled={isRequested}>
              {isRequested ? "Requested" : "Request"}
            </button>
          </div>
        )}
      </div>

      <div>
        {/* for showing input modal */}
        <InputModal
          isOpen={isModalOpen}
          onClose={handleModalOpen}
          submitSolution={submitSolution}
          mainHeading="Ticket Shift Request"
          subHeading="Enter the reason for the ticket shift request."
          placeHolderText="enter the reason for the the request"
        />
      </div>
    </div>
  );
};

export default ManageTicketHeader;
