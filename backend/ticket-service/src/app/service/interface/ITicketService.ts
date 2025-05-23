import { ITicketReassignData } from "../../interface/userTokenData";
import { ITicket } from "../../models/interface/ITicketModel";
import { IBasicResponse } from "../../interface/userTokenData";

export interface IReassignedTicketResponse extends IBasicResponse {
  data?: ITicket | null;
}

export interface IDashboardData extends IBasicResponse {
  data ? : Record <string,any>
}


export interface IfetchAllTicketsEmployeeWise extends IBasicResponse {
  data?: {
    tickets: ITicket[] | null;
    totalPages: number;
  };
}

export interface AllTicketStaticsResp extends IBasicResponse {
  data: {
    totalTickets: number;
    openTickets: number;
    closedTickets: number;
    highPriorityTickets: number;
  };
}

export interface CreateTicketResponse extends IBasicResponse {
  data?: ITicket
}


//========================= INTERFACE FOR TICKET SERVICE =============================================

export interface ITicketService {

  createTicketDocument(
    ticketData: ITicket
  ): Promise<CreateTicketResponse>;

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

  fetchAllTicketsEmployeeWise(
    authUserUUID: string,
    page: number,
    ticketHandlingEmployeeId: string,
    sortBy: string,
    searchQuery: string
  ): Promise<IfetchAllTicketsEmployeeWise>;

  fetchAllTicketEmployeeRaised(
    authUserUUID: string,
    page: number,
    ticketRaisedEmployeeId: string,
    sortBy: string,
    searchQuery: string
  ): Promise<IfetchAllTicketsEmployeeWise>;

  getReassignedTicket(data: ITicketReassignData): Promise<IReassignedTicketResponse>;

  getTicketData(id: string): Promise<IReassignedTicketResponse>;

  getUpdatedTicketStatus(id: string, status: string, ticketResolutions?: string): Promise<IReassignedTicketResponse>;

  editTicketService(id: string, data: Record<string, string>): Promise<IReassignedTicketResponse>;

  tiketReOpenService(id: string, data: Record<string, string>): Promise<IBasicResponse>;

  getFetchTicketStatics(fieldName: string, fieldValue: string): Promise<AllTicketStaticsResp>;

  getTicketResolutionTime (fieldName : string, fieldValue : string) : Promise<string>

  getCompanyDashboardData (authUserUUID:string) : Promise<IDashboardData>

  getEmployeeDashboardData (email : string,authUserUUID : string) : Promise<IDashboardData>;

  
}
