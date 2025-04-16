import TicketForm from "@/components/common/TicketForm";
import React, { useState } from "react";
import GifImage from "../../../assets/gif/star.gif";
import DynamicCard from "@/components/utility/DynamicCard";
import AllTickets from "./AllTickets";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";
import MyTicketProgress from "./MyTicketProgress";
import ViewMyTicketProgress from "@/components/employee/Ticket/ViewMyTicketProgress";
import TicketChat from "@/components/employee/chat/TicketChat";
import { EManageTickets } from "@/components/employee/Ticket/EManageTickets";
import ShiftReq from "./ShiftReq";

interface ISubMenuList {
  header: string;
  description: string;
  buttonText: string;
  image: string;
  onButtonClick: () => void;
}

const subMenuItems = {
  CREATE_TICKET: "Create Ticket",
  ALL_TICKET: "All Tickets",
  MY_TICKET_PROGRESS: "My ticket Progress",
  ANALYSE_TICKETS: "Ticket analyse",
  MANAGE_TICKETS: "Manage Ticket",
  SHOW_CHAT: "Show Chat",
  VIEW_TICKET_PROGRESS: "View My Ticket Progress",
  SHIFT_REQUESTS: "shift requests",
};

export const TicketHome: React.FC = () => {
  //******************component states*************/
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [getTicketID, setTicketID] = useState<string>("");
  const [shiftReqHome, setShiftReqHome] = useState<boolean>(false);
  const [getTicketUUID, setTicketUUID] = useState<string>(""); //ticketuuid is passing for chat , ref : employee/ticketHome

  //*****************functions*****************/
  const company = useSelector((state: Rootstate) => state.company.company);
  const onCancel = () => setActiveSubMenu(null); // go to home
  //go to detail view ticket progress
  const onViewMyTicketProgress = () => setActiveSubMenu(subMenuItems.VIEW_TICKET_PROGRESS);
  const setChatState = () => setActiveSubMenu(subMenuItems.SHOW_CHAT);
  //go to manage ticket ui
  const onManageTicket = () => setActiveSubMenu(subMenuItems.MANAGE_TICKETS);
  //go to shift req home
  const handleShiftReqHome = () => setShiftReqHome(true);

  //handle cancel button action
  const handleCancelButtonAction = () => {
    if (shiftReqHome) {
      setActiveSubMenu(subMenuItems.SHIFT_REQUESTS);
    } else {
      setActiveSubMenu(subMenuItems.ALL_TICKET);
    }
  };

  const subMenuList: ISubMenuList[] = [
    {
      header: "Create Ticket",
      description: "Using the form we can create the ticket",
      buttonText: "Create Ticket",
      image: GifImage,
      onButtonClick: () => setActiveSubMenu(subMenuItems.CREATE_TICKET),
    },
    {
      header: "All Tickets",
      description: "Tap here to view and manage all ticket ",
      buttonText: "View all Tickets",
      image: GifImage,
      onButtonClick: () => setActiveSubMenu(subMenuItems.ALL_TICKET),
    },
    {
      header: "My Ticket Progress",
      description: "Ticket raised by Me , tap to see the progreess and details",
      buttonText: "My Tickets",
      image: GifImage,
      onButtonClick: () => setActiveSubMenu(subMenuItems.MY_TICKET_PROGRESS),
    },
    {
      header: "Ticket analyse",
      description: "Click here to view detailed ticket and department performance",
      buttonText: "View",
      image: GifImage,
      onButtonClick: () => setActiveSubMenu(subMenuItems.ANALYSE_TICKETS),
    },
    {
      header: "Shift Requests",
      description: "Enter to view ticket shift requests submitted by employees",
      buttonText: "Manage Requests",
      image: GifImage,
      onButtonClick: () => setActiveSubMenu(subMenuItems.SHIFT_REQUESTS),
    },
  ];

  const renderSubContent = () => {
    switch (activeSubMenu) {
      case subMenuItems.CREATE_TICKET:
        return (
          <TicketForm
            handleCancel={onCancel}
            ticketRaisedDepartmentName="companyAdmin"
            ticketRaisedDepartmentID={company?._id as string}
            ticketRaisedEmployeeID={company?._id as string}
            ticketRaisedEmployeeName={company?.companyName as string}
            ticketRaisedEmployeeEmail={company?.email as string}
          />
        );
      case subMenuItems.ALL_TICKET:
        return (
          <AllTickets
            handleCancel={onCancel}
            handleManageTicket={onManageTicket}
            handleSetTicketId={(value: string) => setTicketID(value)}
          />
        );

      case subMenuItems.MY_TICKET_PROGRESS:
        return (
          <MyTicketProgress
            handleCancel={onCancel}
            handleSetTicketId={(value: string) => setTicketID(value)}
            handleViewTicketProgress={onViewMyTicketProgress}
          />
        );

      case subMenuItems.VIEW_TICKET_PROGRESS:
        return (
          <ViewMyTicketProgress
            handleCancle={() => setActiveSubMenu(subMenuItems.MY_TICKET_PROGRESS)}
            handleChatSubMenu={setChatState}
            ticketId={getTicketID}
          />
        );

      case subMenuItems.SHOW_CHAT:
        return <TicketChat />;

      case subMenuItems.MANAGE_TICKETS:
        return (
          <EManageTickets
            handleCancle={handleCancelButtonAction}
            handleChatSubMenu={setChatState}
            ticketId={getTicketID}
            handleTicketUUID={(value: string) => setTicketUUID(value)}
          />
        );

      case subMenuItems.SHIFT_REQUESTS:
        return (
          <ShiftReq
            handleCancel={onCancel}
            handleManageTicket={onManageTicket}
            handleShiftReqHome={handleShiftReqHome}
            handleSetTicketId={(value: string) => setTicketID(value)}
          />
        );

      default:
        return (
          <div className="flex flex-wrap gap-12 justify-ce p-6">
            {subMenuList.map((menu, index) => (
              <DynamicCard
                key={index}
                header={menu.header}
                description={menu.description}
                buttonText={menu.buttonText}
                image={menu.image}
                onButtonClick={menu.onButtonClick}
              />
            ))}
          </div>
        );
    }
  };

  return <div>{renderSubContent()}</div>;
};
