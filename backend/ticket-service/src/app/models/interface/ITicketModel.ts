import { Document } from "mongoose";

export enum TicketStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Resolved = 'resolved',
  Closed = 'closed',
  ReOpened = 're-opened'
}


export interface ITicket extends Document {
  ticketID: string;
  authUserUUID: string;
  ticketReason: string;
  description: string;
  priority: string;
  dueDate: string;
  supportType: string;
  status: TicketStatus;
  imageUrl: string;

  ticketHandlingDepartmentId: string;
  ticketHandlingDepartmentName: string;
  ticketHandlingEmployeeId: string;
  ticketHandlingEmployeeName: string;
  ticketHandlingEmployeeEmail:string;

  ticketRaisedEmployeeId: string;
  ticketRaisedEmployeeName: string;
  ticketRaisedEmployeeEmail: string;
  ticketRaisedDepartmentName: string;
  ticketRaisedDepartmentId: string;
}
