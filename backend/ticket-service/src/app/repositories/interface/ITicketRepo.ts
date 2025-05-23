import { ITicketReassignData } from "../../interface/userTokenData";
import { ITicket } from "../../models/interface/ITicketModel";
import { IBaseRepository } from "./IBaseRepo";

export interface IupdateOnTicketClose {
  id: string;
  status: string;
  ticketResolutions: string;
  ticketClosedDate: string;
  resolutionTime: string;
}

export interface StatusCount {
  [key: string]: number;
}

export interface IFindAllTicketForEmployeeRaised {
  authUserUUID: string;
  page: number;
  sortBy: string;
  searchQuery: string;
  ticketRaisedEmployeeId: string;
}

export interface ITicketRepository extends IBaseRepository<ITicket> {
  createTicket(ticket: ITicket): Promise<ITicket>;

  findOneDocument(query: Record<string, string>): Promise<ITicket | null>;

  findAllTickets(
    authUserUUID: string,
    page: number,
    sortBy: string,
    searchQuery: string
  ): Promise<{ tickets: ITicket[] | null; totalPages: number }>;

  findAllTicketForEmployee(
    authUserUUID: string,
    ticketHandlingEmployeeId: string,
    page: number,
    sortBy: string,
    searchQuery: string
  ): Promise<{ tickets: ITicket[] | null; totalPages: number }>;

  findAllTicketsForEmployeeRaised(
    data: IFindAllTicketForEmployeeRaised
  ): Promise<{ tickets: ITicket[] | null; totalPages: number }>;

  ticketReassign(data: ITicketReassignData): Promise<ITicket | null>;

  findAndupdateStatus(
    id: string,
    status: string,
    ticketResolutions?: string
  ): Promise<ITicket | null>;

  updateOnTicketClose(updateData: IupdateOnTicketClose): Promise<ITicket | null>;

  editTicketRepo(id: string, udpateData: Record<string, string>): Promise<ITicket | null>;

  getAverageResolutionTime(fieldName: string, fieldValue: string): Promise<string>;

  getDynamicTicketStatusCounts(
    fieldName: string,
    fieldValue: string,
    statuses: string[]
  ): Promise<StatusCount>;

  getDepartmentTicketCounts(filedName: string, fieldValue: string): Promise<StatusCount>;

  getUnResolvedTicketsByPriority(fieldName: string, fieldValue: string): Promise<StatusCount>;

  getTopGroupCount(
    mathchField: string,
    matchValue: string,
    groupField: string
  ): Promise<{ name: string; count: number }>;
}
