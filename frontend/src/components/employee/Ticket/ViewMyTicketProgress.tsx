import { updateTicketStatus } from "@/api/services/ticketService";
import ManageTicketUI from "@/components/common/ManageTicketUI";
import TicketProgressHeader from "@/components/common/TicketProgressHeader";
import { DockDemo } from "@/components/magicui/DockDemo";
import { Skeleton } from "@/components/ui/skeleton";
import getDate from "@/components/utility/getDate";
import getErrMssg from "@/components/utility/getErrMssg";
import useTicketData from "@/customHooks/useTicketData";
import { Messages } from "@/enums/Messages";
import { ITicketDocument } from "@/interfaces/ITicketDocument";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface IViewMyTicketProgress {
  handleCancle: () => void;
  handleChatSubMenu: (uuid: string, ticketRaisedEmployeeId: string, ticketHandlingEmployeeId: string) => void;
  ticketId: string;
}

const ViewMyTicketProgress: React.FC<IViewMyTicketProgress> = ({ handleCancle, handleChatSubMenu, ticketId }) => {
  const { ticketData, loading, refetch } = useTicketData(ticketId);
  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [currentProgress, setCurrentProgress] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const createdDate = getDate(ticketData?.createdAt as string);
  const lastUpdatedOn = getDate(ticketData?.updatedAt as string);

  //to handle video call
  const navigate = useNavigate();

  const handleVideoCall = () => {
    if (!ticketData) return;

    const roomID = ticketData.ticketID;
    const userID = ticketData.ticketRaisedEmployeeId.toString() || "user2";
    const userName = ticketData.ticketRaisedEmployeeName.toString() || "ticketFlow user2";

    navigate(`video-call?ticketID=${roomID}&userID=${userID}&userName=${userName}`);
  };

  const handleModalOpen = () => setModalOpen(false);

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
    } catch (error) {
     toast.error(getErrMssg(error))
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
    } catch (error) {
      toast.error(getErrMssg(error));
    }
  };

  useEffect(() => {
    if (ticketData) {
      setTicketStatus(ticketData.status);
      setCurrentProgress(ticketData.status);
      setIsVisible(false);
    }
  }, [ticketData]);

  return (
    <div>
      <div className="flex items-center justify-between   p-2">
        <div
          className="text-2xl w-10 bg-white p-2 rounded-2xl shadow-lg shadow-gray-400 hover:bg-blue-500 hover:text-white"
          onClick={handleCancle}>
          <IoMdArrowRoundBack />{" "}
        </div>
        <div className="">
          <h1 className="text-2xl  font-semibold">My Ticket Progress</h1>
        </div>
        <div>
          <h1>{""}</h1>
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
          <header>
            <TicketProgressHeader
              ticketData={ticketData as ITicketDocument}
              createdDate={createdDate}
              currentProgress={currentProgress}
              refetch={refetch}
            />
          </header>

          <main>
            {/* ticket management body */}
            <ManageTicketUI
              handleModalOpen={handleModalOpen}
              handleTicketStatusUpdate={handleTicketStatusUpdate}
              isVisible={isVisible}
              isModalOpen={isModalOpen}
              lastUpdatedOn={lastUpdatedOn}
              submitSolution={handleResolution}
              ticketData={ticketData as ITicketDocument}
            />
          </main>

          <footer>
            <div className="flex flex-col items-center justify-center mt-4">
              <h2 className="text-center font-semibold">
                any additional support
                <hr className="border-gray-400" />
              </h2>
              {/* only show if the ticketData is avilable */}
              {ticketData && (
                <div>
                  <DockDemo
                    ticketId={ticketData.ticketID}
                    handleChat={() =>
                      handleChatSubMenu(
                        ticketData.ticketID,
                        ticketData.ticketRaisedEmployeeId,
                        ticketData.ticketHandlingEmployeeId
                      )
                    }
                    handleVideoCall={handleVideoCall}
                  />
                </div>
              )}
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ViewMyTicketProgress;
