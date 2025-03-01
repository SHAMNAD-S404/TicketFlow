import { ITicketReassignData } from "../../interface/userTokenData";
import { ITicket } from "../../models/interface/ITicketModel";
import { IBasicResponse } from "../../interface/userTokenData";

export interface IReassignedTicketResponse extends IBasicResponse{
  data ? : ITicket | null
}


export interface ITicketService {
  createTicketDocument(
    ticketData: ITicket
  ): Promise<{ message: string; success: boolean; statusCode: number; data?: ITicket }>;

  fetchAllTickets(
    authUserUUID: string,
    page: number,
    sortBy: string,
    searchQuery: string
  ): Promise<{
    message: string;
    statusCode: number;
    success: boolean;
    data?: { tickets: ITicket[] | null; totalPages: number };
  }>;

  getReassignedTicket(data:ITicketReassignData) : Promise< IReassignedTicketResponse >
}
