import { Document } from "mongoose";

export interface ITicketShiftReq extends Document {
  authUserUUID : string;
  ticketID: string;
  ticketObjectId: string;
  reason: string;
  ticketHandlingDepartmentId : string;
  ticketHandlingDepartmentName: string;
  ticketHandlingEmployeeName: string;
  ticketHandlingEmployeeId : string;
}
