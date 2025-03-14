import TicketForm from "@/components/common/TicketForm";
import React, { useState } from "react";
import GifImage from "../../../assets/gif/star.gif";
import DynamicCard from "@/components/utility/DynamicCard";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import AssignedTickets from "./AssignedTickets";
import { EManageTickets } from "./EManageTickets";
import TickeChat from "../chat/TicketChat";

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
  ANALYSE_TICKETS : "Ticket analyse",
  MANAGE_TICKETS : "Manage Ticket",
  SHOW_CHAT : "Show Chat",

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
      buttonText: "MY Tickets",
      image: GifImage,
      onButtonClick : ()=> setActiveSubMenu(subMenuItems.ASSIGNED_TICKETS)
    },{
        header : "Ticket analyse",
        description : "Click here to view detailed ticket and department performance",
        buttonText : "View",
        image : GifImage,
        onButtonClick : ()=> setActiveSubMenu(subMenuItems.ANALYSE_TICKETS)
    }
  ];

  const onCancel = () => setActiveSubMenu(null);
  const onManageTicket = () => setActiveSubMenu(subMenuItems.MANAGE_TICKETS)

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
