import { ITicketReassignData } from "../../interface/userTokenData";
import { ITicket } from "../../models/interface/ITicketModel";
import { IBaseRepository } from "./IBaseRepo";

export interface ITicketRepository extends IBaseRepository<ITicket> {

  createTicket(ticket: ITicket): Promise<ITicket>;

  findOneDocument(query: Record<string, string>): Promise<ITicket | null>;

  findAllTickets(
    authUserUUID: string,
    page: number,
    sortBy: string,
    searchQuery: string
  ): Promise<{ tickets: ITicket[] | null; totalPages: number }>;

  ticketReassign(data:ITicketReassignData) : Promise<ITicket | null>

}
