import TicketForm from "@/components/common/TicketForm";
import React, { useState } from "react";
import GifImage from "../../../assets/gif/star.gif";
import DynamicCard from "@/components/utility/DynamicCard";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux/store";

interface ISubMenuList {
  header: string;
  description: string;
  buttonText: string;
  image: string;
  onButtonClick : () => void;
}

export const TicketHome: React.FC = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const employee = useSelector((state:Rootstate) => state.employee.employee);
  const subMenuList: ISubMenuList[] = [
    {
      header: "Create Ticket",
      description: "Using the form we can create the ticket",
      buttonText: "Create Ticket",
      image: GifImage,
      onButtonClick : () => setActiveSubMenu("Create Ticket")
    },
    {
      header: "Assigned Tickets For me",
      description: "Assigned tickets for me that i want to work on that",
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
        ticketRaisedDepartmentName={employee?.departmentName as string}
        ticketRaisedDepartmentID={employee?.departmentId as string}
        ticketRaisedEmployeeID={employee?._id as string}
        ticketRaisedEmployeeName={employee?.name as string}
        handleCancel={onCancel} />;
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
