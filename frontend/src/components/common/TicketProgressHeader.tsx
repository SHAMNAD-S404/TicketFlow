import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React, { useState } from "react";
import EditTicket from "./EditTicket";
import InputModal from "./InputModal";
import { reOpenTicket } from "@/api/services/ticketService";
import { toast } from "react-toastify";
import getErrMssg from "../utility/getErrMssg";

interface ITicketProgressHeader {
  ticketData: ITicketDocument;
  createdDate: string;
  currentProgress: string;
  refetch: () => void;
}

const TicketProgressHeader: React.FC<ITicketProgressHeader> = ({
  createdDate,
  ticketData,
  currentProgress,
  refetch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reOpenModal, setReOpenModal] = useState<boolean>(false);

  //to handle modal close
  const hanldeModalClose = () => setIsModalOpen(false);
  const handleReOpenModalClose = () => setReOpenModal(false);

  const reOpenStatus: boolean = currentProgress === "resolved";
  const gridCols = reOpenStatus ? "grid-cols-6" : "grid-cols-5";

  //handle tikcet reopen
  const handleReopen = async (reason: string) => {
    try {
      const documentId = ticketData._id;
      const response = await reOpenTicket(documentId, reason);
      if (response.success) {
        handleReOpenModalClose();
        refetch(); //to refetch latest ticket info from parent
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
    }
  };

  return (
    <div className="mt-6 px-4">
      {/* Header Row */}
      <header>
        <div className={`grid ${gridCols} text-center font-semibold`}>
          <div>Ticket ID</div>
          <div>Priority level</div>
          <div>Ticket created date</div>
          <div>Current Progress</div>
          <div>Edit Ticket</div>
          {reOpenStatus && <div> Re-open ticket </div>}
        </div>
      </header>

      <hr className="border-gray-400 my-2" />
      <main>
        {/* Data Row */}
        <div className={`grid ${gridCols} gap-12 text-center font-medium`}>
          <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{ticketData?.ticketID}</div>
          <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{ticketData?.priority}</div>
          <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{createdDate}</div>
         
          <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{currentProgress}</div>
          <div
            className="rounded-2xl hover:bg-blue-600 p-2 shadow-xl bg-black cursor-pointer"
            onClick={() => setIsModalOpen(true)}>
            <button className="text-white font-semibold">edit</button>
          </div>
          {reOpenStatus && (
            <div
              className="rounded-2xl hover:bg-green-600 p-2 shadow-xl bg-black cursor-pointer"
              onClick={() => setReOpenModal(true)}>
              <button className="text-white font-semibold">Re-open</button>
            </div>
          )}
        </div>
        {/* input modal for ticket reopen reason */}
        <InputModal
          isOpen={reOpenModal}
          onClose={handleReOpenModalClose}
          submitSolution={handleReopen}
          mainHeading="Ticket Re-open"
          subHeading="Update the reason for reopening this ticket"
          placeHolderText="enter the reason"
        />
      </main>
      <footer>
        <EditTicket isOpen={isModalOpen} onClose={hanldeModalClose} ticketData={ticketData} refetch={refetch} />
      </footer>
    </div>
  );
};

export default TicketProgressHeader;
