import TicketForm from "@/components/common/TicketForm";
import React, { useState } from "react";
import GifImage from "../../../assets/gif/star.gif";
import DynamicCard from "@/components/utility/DynamicCard";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import AssignedTickets from "./AssignedTickets";
import { EManageTickets } from "./EManageTickets";
import TickeChat from "../chat/TicketChat";
import MyTicketProgress from "./MyticketProgress";
import ViewMyTicketProgress from "./ViewMyTicketProgress";

interface ISubMenuList {
  header: string;
  description: string;
  buttonText: string;
  image: string;
  onButtonClick : () => void;
}

const subMenuItems  = {
  CREATE_TICKET : "Create Ticket",
  ASSIGNED_TICKETS : "Assigned Tickets For me",
  MY_TICKET_PROGRESS : "My ticket Progress",
  ANALYSE_TICKETS : "Ticket analyse",
  MANAGE_TICKETS : "Manage Ticket",
  SHOW_CHAT : "Show Chat",
  VIEW_TICKET_PROGRESS : "View My Ticket Progress",

}

export const TicketHome: React.FC = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [getTicketID , setTicketID] = useState<string>("");
  const employee = useSelector((state:Rootstate) => state.employee.employee);
  const subMenuList: ISubMenuList[] = [
    {
      header: "Create Ticket",
      description: "Using the form we can create the ticket",
      buttonText: "Create Ticket",
      image: GifImage,
      onButtonClick : () => setActiveSubMenu(subMenuItems.CREATE_TICKET)
    },
    {
      header: "Assigned Tickets For me",
      description: "Assigned tickets for me that i want to work on that",
      buttonText: "My Tickets",
      image: GifImage,
      onButtonClick : ()=> setActiveSubMenu(subMenuItems.ASSIGNED_TICKETS)
    },
    {

      header: "My Ticket Progress",
      description : "Click to see the ticket progress",
      buttonText : "Ticket Progress",
      image:GifImage,
      onButtonClick : ()=> setActiveSubMenu(subMenuItems.MY_TICKET_PROGRESS)

    },
    {
        header : "Ticket analyse",
        description : "Click here to view detailed ticket and department performance",
        buttonText : "View",
        image : GifImage,
        onButtonClick : ()=> setActiveSubMenu(subMenuItems.ANALYSE_TICKETS)
    }
  ];

  //go back to ticket home
  const onCancel = () => setActiveSubMenu(null);
  //go to manage ticket page
  const onManageTicket = () => setActiveSubMenu(subMenuItems.MANAGE_TICKETS);
  //go to view my ticketProgress Page
  const onViewMyTicketProgress = () => setActiveSubMenu(subMenuItems.VIEW_TICKET_PROGRESS);

  const renderSubContent = () => {
    switch (activeSubMenu) {

      case subMenuItems.CREATE_TICKET:
        return <TicketForm 
        ticketRaisedDepartmentName={employee?.departmentName as string}
        ticketRaisedDepartmentID={employee?.departmentId as string}
        ticketRaisedEmployeeID={employee?._id as string}
        ticketRaisedEmployeeName={employee?.name as string}
        ticketRaisedEmployeeEmail={employee?.email as string}
        handleCancel={onCancel} />;

      case subMenuItems.ASSIGNED_TICKETS : 
        return <AssignedTickets
          handleCancel={onCancel}
          handleSetTicketId = {(value:string)=> setTicketID(value) }
          handleManageTicket={onManageTicket}
        />
      case subMenuItems.MANAGE_TICKETS : 
        return <EManageTickets
        handleCancle = {()=> setActiveSubMenu("Assigned Tickets For me")}
        ticketId={getTicketID}
        handleChatSubMenu={()=> setActiveSubMenu(subMenuItems.SHOW_CHAT)}
        />

      case subMenuItems.SHOW_CHAT : 
        return <TickeChat/>
      
      case subMenuItems.MY_TICKET_PROGRESS :
        return <MyTicketProgress
          handleCancel={onCancel}
          handleSetTicketId={(value:string) => setTicketID(value) }
          handleViewTicketProgress={onViewMyTicketProgress}
        />
      
      case subMenuItems.VIEW_TICKET_PROGRESS :
        return <ViewMyTicketProgress
          handleCancle={()=> setActiveSubMenu(subMenuItems.MY_TICKET_PROGRESS)}
          ticketId={getTicketID}
          handleChatSubMenu={()=> setActiveSubMenu(subMenuItems.SHOW_CHAT)}
        />
      
      default:
        return (
          <div className="flex flex-wrap gap-12 justify-start p-6">
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
