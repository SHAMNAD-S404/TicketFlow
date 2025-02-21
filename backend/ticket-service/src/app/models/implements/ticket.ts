import mongoose,{Document, Schema} from "mongoose";
import { ITicket } from "../interface/ITicketModel";

const ticketSchema : Schema = new Schema<ITicket> ({
    ticketReason : {
        type : String , required : true
    },
    description : {
        type : String, required : true
    },
    ticketHandlingDepartmentId : {
        type : String , required : true
    },
    ticketHandlingDepartmentName : {
        type : String , required : true
    },
    priority : {
        type : String , required : true
    },
    dueData : {
        type : String ,required : true
    },
    supportType : {
        type : String , required : true
    },
    ticketRaisedEmployeeId : {
        type : String , required : true
    },
    ticketRaisedDepartmentName : {
        type : String , required : true 
    },
    ticketHandlingEmployeeName : {
        type : String , required : true
    },
    status : {
        type : String , required : true , default : "committed"
    },
    imageUrl : {
        type : String
    }

   

},{
    timestamps:true
})

const TicketModel = mongoose.model<ITicket & Document>("tickets",ticketSchema)
export default TicketModel;