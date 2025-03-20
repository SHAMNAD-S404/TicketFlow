import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { ITicketDocument } from "@/interfaces/ITicketDocument";
import { fetchOneTicket, updateTicketStatus } from "@/api/services/ticketService";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { Skeleton } from "@/components/ui/skeleton";
import InputModal from "@/components/common/InputModal";

interface IViewTickets {
  ticketId: string;
  twickParent: () => void;
}

export const ViewTickets: React.FC<IViewTickets> = ({ ticketId, twickParent }) => {
  const [ticketData, setTicketData] = useState<ITicketDocument | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  const ticketStatusArr: string[] = ["pending", "in-progress", "resolved", "re-opened"];
  const currentIndex = ticketStatusArr.indexOf(ticketStatus);
  const nextTicketStatus =
    currentIndex !== -1 && currentIndex < ticketStatusArr.length - 1
      ? ticketStatusArr[currentIndex + 1]
      : ticketStatusArr[1];
  //   to formate date
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

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
        setTicketStatus(ticketStatus);
        setCurrentStatus(ticketStatus);
        toast.success(response.message);
        setIsVisible(false);
        twickParent();
        setIsOpen(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.SOMETHING_TRY_AGAIN);
      }
    }
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
      if (ticketStatus === "re-opened" && ticketData?.status !== "resolved") {
        toast.warn("only resolved ticket can re-open");
        return;
      }
      if (ticketStatus === "resolved") {
        setModalOpen(true);
        return;
      }

      const response = await updateTicketStatus(ticketData._id, ticketStatus);
      if (response.success) {
        toast.success(response.message);
        setCurrentStatus(ticketStatus);
        twickParent();
        setIsOpen(false);
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
    if (isOpen) {
      const fetchticketData = async () => {
        try {
          const response = await fetchOneTicket(ticketId);
          if (response.success) {
            setTicketData(response.data);
            setTicketStatus(response.data.status);
            setCurrentStatus(response.data.status);
            setIsVisible(false);
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
      fetchticketData();
    }
  }, [isOpen, ticketId]);

  return (
    <div>
      <div className="flex justify-center">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <button type="button">
              <FaEye />{" "}
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-4/7  text-white ">
            <DrawerHeader>
              <DrawerTitle className="text-center text-2xl">Ticket details</DrawerTitle>
              <DrawerDescription className="text-center text-white">View and manage tickets.</DrawerDescription>
            </DrawerHeader>
            {ticketData && (
              <header>
                <div className="mt- px-4">
                  {/* Header Row */}
                  <div className="grid grid-cols-6 text-center font-semibold">
                    <div>Ticket ID</div>
                    <div>Priority level</div>
                    <div>Ticket created date</div>
                    <div>Ticket due date</div>
                    <div>Current Progress</div>
                    <div className="text-blue-500">Update Progress</div>
                  </div>
                  <hr className="border-gray-400 my-2" />

                  {/* Data Row */}
                  <div className="grid grid-cols-6 gap-12 text-center font-medium text-black ">
                    <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">
                      {ticketData.ticketID}
                    </div>
                    <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">
                      {ticketData?.priority}
                    </div>
                    <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">
                      {new Date(ticketData.createdAt).toLocaleDateString("en-Us", options)}
                    </div>
                    <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">
                      {ticketData.dueDate}
                    </div>
                    <div className="rounded-2xl bg-white p-2 shadow-xl border border-b-blue-500">{currentStatus}</div>
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
            )}

            {ticketData ? (
              // parentDiv
              <div className="flex mt-8  gap-4">
                {/* image div */}
                <div className="flex w-1/4 ms-4">
                  <div>
                    <h1 className="text-center text-lg text-green-500 ">Attached media file</h1>
                    <div className="">
                      {ticketData.imageUrl ? (
                        <div className="flex justify-center items-center">
                          <img className="rounded-xl w-6/6 h-80" src={ticketData.imageUrl} alt="ticket image" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 justify-center items-center ">
                          <Skeleton className="h-[350px] w-[380px]  bg-gray-800 rounded-xl" />
                          <h1 className="text-red-600 font-semibold">No media attached with this Ticket</h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* content div 1 */}
                <div className="flex flex-col w-1/4 gap-2">
                  <h1 className="text-lg  ">Ticket Raised for :</h1>
                  <div className="bg-gray-200 rounded-lg w-full h-3/6">
                    <textarea
                      readOnly
                      className="text-black p-3 w-full h-full rounded-lg bg-gray-100 font-mono "
                      value={ticketData.ticketReason}></textarea>
                  </div>

                  <h2 className="text-lg font-medium mt-2">
                    Ticket raised department :{" "}
                    <span className="text-green-400 font-semibold ">{ticketData.ticketRaisedDepartmentName}</span>{" "}
                  </h2>
                  <h2 className="text-lg font-medium">
                    Ticket raised employee :{" "}
                    <span className="text-green-400 font-semibold ">{ticketData.ticketRaisedEmployeeName}</span>{" "}
                  </h2>
                  <h2 className="text-lg font-medium">
                    Ticket last got updated on :{" "}
                    <span className="text-green-400 font-semibold ">{new Date(ticketData.dueDate).toLocaleDateString("en-Us", options)}</span>{" "}
                  </h2>

                 
                </div>
                {/* content div 2  */}
                <div className="flex flex-col w-1/4 gap-2">
                  <h1 className="text-lg ">Ticket description :</h1>
                  <div className="bg-gray-200 rounded-lg w-full h-3/6">
                    <textarea
                      readOnly
                      className="text-black bg-gray-100 p-3 w-full h-full rounded-lg font-mono "
                      value={ticketData.description}></textarea>
                  </div>
                  <h2 className="text-lg font-medium mt-2">
                    Ticket handling department :{" "}
                    <span className="text-blue-400 font-semibold  ">{ticketData.ticketHandlingDepartmentName}</span>{" "}
                  </h2>
                  <h2 className="text-lg font-medium">
                    Ticket handling employee :{" "}
                    <span className="text-blue-400 font-semibold ">{ticketData.ticketHandlingEmployeeName}</span>{" "}
                  </h2>
                
                  <h2 className="text-lg">
                    Support Type : <span className="font-semibold ">{ticketData.supportType}</span>{" "}
                  </h2>
                
                </div>
                {/* content div 3 ticket resolutions*/}
                {ticketData.ticketResolutions && (
                  <>
                    <div className="flex flex-col w-1/4 gap-2 ">
                <h1 className="text-lg ">Ticket resolution provided :</h1>
                <div className="bg-gray-200 rounded-lg w-full h-3/6">
                    <textarea
                      readOnly
                      className="text-black bg-gray-100 p-3 w-full h-full rounded-lg font-mono "
                      value={ticketData.ticketResolutions}></textarea>
                  </div> 
           
                </div>

                  </>
                )}

              
                <div>
                  <InputModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    submitSolution={handleResolution}
                  />
                </div>
              </div>
            ) : (
              <p className="text-blue-500">Loading .........</p>
            )}

            <div className="flex justify-center">
              <button
                className={`bg-blue-600  hover:bg-green-500  transition-opacity duration-300  text-white p-2 font-semibold rounded-xl w-1/5
                    ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}   `}
                onClick={handleTicketStatusUpdate}>
                Submit
              </button>
            </div>

            <DrawerClose>
              <button className="bg-red-600 mt-2 mb-1  hover:bg-gray-100 hover:text-black  text-white p-2 font-semibold rounded-xl w-1/5 ">
                cancel
              </button>
            </DrawerClose>

            <DrawerFooter>
              <div className="mt-2 ">{""}</div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
