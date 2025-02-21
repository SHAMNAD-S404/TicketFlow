import { ITicket } from "../../models/interface/ITicketModel";
import { IBaseRepository } from "./IBaseRepo";


export interface ITicketRepository extends IBaseRepository<ITicket> {
    createTicket(ticket:ITicket) : Promise<ITicket>;
}