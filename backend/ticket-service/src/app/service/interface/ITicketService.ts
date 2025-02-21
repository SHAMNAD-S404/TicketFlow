import { ITicket } from "../../models/interface/ITicketModel";

export interface ITicketService {
    createTicketDocument (ticketData : ITicket) : Promise <{message:string,success:boolean,statusCode:number,data?:ITicket}>
}