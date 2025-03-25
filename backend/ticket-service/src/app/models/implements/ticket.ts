import mongoose, { Document, Schema } from "mongoose";
import { ITicket } from "../interface/ITicketModel";
import { TicketStatus } from "../interface/ITicketModel";

const ticketSchema: Schema = new Schema<ITicket>(
  {
    authUserUUID: {
      type: String,
      required: true,
    },
    ticketID: {
      type: String,
      required: true,
    },
    ticketReason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    supportType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.Pending,
    },
    imageUrl: {
      type: String,
    },
    ticketResolutions: {
      type: String,
      default: "",
    },
    ticketClosedDate: {
      type: String,
    },
    resolutionTime: {
      type: String,
    },
    ticketReopenReason : {
      type : String
    },
    ticketHandlingDepartmentId: {
      type: String,
      required: true,
    },
    ticketHandlingDepartmentName: {
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
    ticketHandlingEmployeeEmail: {
      type: String,
      required: true,
    },

    ticketRaisedEmployeeId: {
      type: String,
      required: true,
    },

    ticketRaisedEmployeeName: {
      type: String,
      required: true,
    },

    ticketRaisedEmployeeEmail: {
      type: String,
      required: true,
    },

    ticketRaisedDepartmentName: {
      type: String,
      required: true,
    },
    ticketRaisedDepartmentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TicketModel = mongoose.model<ITicket & Document>("tickets", ticketSchema);
export default TicketModel;
