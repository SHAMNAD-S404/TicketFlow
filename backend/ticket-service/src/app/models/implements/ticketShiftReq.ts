import mongoose, { Document, Schema } from "mongoose";
import { ITicketShiftReq } from "../interface/ITicketShiftReq";

const ticketShiftReqScheam: Schema = new Schema<ITicketShiftReq>(
  {
    authUserUUID: {
      type: String,
      required: true,
    },
    ticketObjectId: {
      type: String,
      required: true,
    },
    ticketID: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    ticketHandlingEmployeeName: {
      type: String,
      required: true,
    },
    ticketHandlingEmployeeId: {
      type: String,
      required: true,
    },
    ticketHandlingDepartmentId: {
      type: String,
      required: true,
    },
    ticketHandlingDepartmentName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TicketShiftReqModel = mongoose.model<ITicketShiftReq & Document>(
  "ticketShiftRequests",
  ticketShiftReqScheam
);
export default TicketShiftReqModel;
