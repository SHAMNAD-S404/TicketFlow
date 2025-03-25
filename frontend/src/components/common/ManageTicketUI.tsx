import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import TicketDiscriptionCard from "./TicketDiscriptionCards";
import InputModal from "./InputModal";

interface IManageTicketUI {
  ticketData: ITicketDocument;

  lastUpdatedOn: string;
  isVisible: boolean;
  isModalOpen: boolean;
  handleTicketStatusUpdate: () => void;
  handleModalOpen: () => void;
  submitSolution: (data: string) => void;
}

const ManageTicketUI: React.FC<IManageTicketUI> = ({
  ticketData,
  lastUpdatedOn,
  isVisible,
  handleTicketStatusUpdate,
  isModalOpen,
  handleModalOpen,
  submitSolution,
}) => {
  return (
    <div>
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
          {/* for showing input modal */}
          <InputModal
            isOpen={isModalOpen}
            onClose={handleModalOpen}
            submitSolution={submitSolution}
            mainHeading="Ticket resolutions"
            subHeading="Update the resolutions you provided on the ticket to resolve."
            placeHolderText="enter the resolutions you provide"
          />
        </div>
      </main>
    </div>
  );
};

export default ManageTicketUI;
