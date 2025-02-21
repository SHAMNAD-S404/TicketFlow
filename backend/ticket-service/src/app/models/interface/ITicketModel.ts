import { Document } from "mongoose";

export interface ITicket extends Document {
   ticketReason : string;
   description : string;
   ticketHandlingDepartmentId : string,
   ticketHandlingDepartmentName : string,
   priority : string;
   dueData : string;
   supportType : string;
   ticketRaisedEmployeeId : string,
   ticketRaisedDepartmentName : string
   ticketHandlingEmployeeName : string,
   status : string,
   imageUrl : string,

}