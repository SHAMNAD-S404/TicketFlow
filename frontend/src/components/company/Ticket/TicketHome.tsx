import TicketForm from "@/components/common/TicketForm";
import React, { useState } from "react";
import GifImage from "../../../assets/gif/star.gif";
import DynamicCard from "@/components/utility/DynamicCard";
import ManageTickets from "./ManageTickets";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";
import AssignedTickets from "./AssignedTickets";

interface ISubMenuList {
  header: string;
  description: string;
  buttonText: string;
  image: string;
  onButtonClick : () => void;
}

export const TicketHome: React.FC = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const backToMainMenu = ()=> setActiveSubMenu(null);
  const company = useSelector((state:Rootstate) => state.company.company)
  


  const subMenuList: ISubMenuList[] = [
    {
      header: "Create Ticket",
      description: "Using the form we can create the ticket",
      buttonText: "Create Ticket",
      image: GifImage,
      onButtonClick : () => setActiveSubMenu("Create Ticket")
    },
    {
      header: "Manage Tickets",
      description: "Tap here to view and manage ticket ",
      buttonText: "Manage Tickets",
      image: GifImage,
      onButtonClick : ()=> setActiveSubMenu("Manage Tickets")
    },
    {
      header: "My Ticket Progress",
      description: "Ticket raised by Me , tap to see the progreess and details",
      buttonText: "MY Tickets",
      image: GifImage,
      onButtonClick : ()=> setActiveSubMenu("My Tickets")
    },{
        header : "Ticket analyse",
        description : "Click here to view detailed ticket and department performance",
        buttonText : "View",
        image : GifImage,
        onButtonClick : ()=> setActiveSubMenu("Ticket analyse")
    }
  ];

  const onCancel = () => setActiveSubMenu(null);

  const renderSubContent = () => {
    switch (activeSubMenu) {
      case "Create Ticket":
        return <TicketForm 
        handleCancel = {onCancel} 
        ticketRaisedDepartmentName = "companyAdmin"
        ticketRaisedDepartmentID = {company?._id as string}
        ticketRaisedEmployeeID = {company?._id as string}
        ticketRaisedEmployeeName = {company?.companyName as string}
        ticketRaisedEmployeeEmail = {company?.email as string}

        />;
      case "Manage Tickets" :
        return <ManageTickets  handleCancel = {backToMainMenu} />;
      case "My Tickets"  : 
        return <AssignedTickets handleCancel={backToMainMenu} />
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
