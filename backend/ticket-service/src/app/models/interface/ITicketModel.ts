import { Document } from "mongoose";

export enum TicketStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Resolved = "resolved",
  ReOpened = "re-opened",
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
  ticketResolutions: string;
  ticketClosedDate: string;
  createdAt?: string;
  resolutionTime: string;
  ticketReopenReason?: string;

  ticketHandlingDepartmentId: string;
  ticketHandlingDepartmentName: string;
  ticketHandlingEmployeeId: string;
  ticketHandlingEmployeeName: string;
  ticketHandlingEmployeeEmail: string;

  ticketRaisedEmployeeId: string;
  ticketRaisedEmployeeName: string;
  ticketRaisedEmployeeEmail: string;
  ticketRaisedDepartmentName: string;
  ticketRaisedDepartmentId: string;
}
