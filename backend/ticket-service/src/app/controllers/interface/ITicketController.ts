import { Request , Response } from "express";

export interface ITicketController {
    createTicket (req:Request , res : Response) : Promise< void >;
    getAllTickets ( req:Request, res:Response ) : Promise< void >;
    ticketReassign (req:Request , res : Response) : Promise< void >;
    fetchTicket (req:Request , res: Response) : Promise< void >;
    updateTicketStatus (req: Request , res : Response) : Promise < void >;

    
}