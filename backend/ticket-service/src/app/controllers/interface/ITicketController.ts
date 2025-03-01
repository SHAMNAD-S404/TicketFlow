import { Request , Response } from "express";

export interface ITicketController {
    createTicket (req:Request , res : Response) : Promise< void >;
    getAllTickets ( req:Request, res:Response ) : Promise< void >;
    ticketReassign (req:Request , res : Response) : Promise< void >;

    
}