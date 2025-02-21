import { Request , Response } from "express";
import { ITicketController } from "../interface/ITicketController";
import { ITicketService } from "../../service/interface/ITicketService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import TicketModel from "../../models/implements/ticket";
import mongoose from "mongoose";


export class TicketController implements ITicketController {
    private readonly ticketService : ITicketService;
    constructor(TicketServcie : ITicketService){
            this.ticketService = TicketServcie;
    }

    public createTicket = async (req: Request, res: Response):Promise< void > =>{
        try {
            console.log("query : " , req.query);
            console.log("body : " , req.body );
            console.log("path : " , req.file?.path);

            const { authUserUUID , email,role} = req.query;
            const {ticketReason , description,department ,priority,dueDate, supportType  , assignedEmployee ,ticketRaisedDepartmentName ,ticketSendingDepartmentName ,ticketHandlingEmployeeName  } = req.body
            const imageUrl = req.file?.path;

            const ticketData = new TicketModel({
                ticketReason,
                description,
                ticketHandlingDepartmentId : department,
                ticketHandlingDepartmentName : ticketSendingDepartmentName,
                priority,
                dueData : dueDate,
                supportType,
                ticketRaisedEmployeeId : authUserUUID,
                ticketRaisedDepartmentName : ticketRaisedDepartmentName,
                ticketHandlingEmployeeName ,
                status : "commited",
                imageUrl 


            })

            const saveTicket  = await this.ticketService.createTicketDocument(ticketData)
            const {message,statusCode,success,data} = saveTicket
            res.status(statusCode).json({
                message,
                success,
                statusCode,
                data
            })
 


            
            
            
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:Messages.SERVER_ERROR,
                success:false
            })
            
        }
    }
}