import { ITicket } from "../../models/interface/ITicketModel";
import TicketRepository from "../../repositories/implements/ticketRepository";
import { IReassignedTicketResponse, ITicketService } from "../interface/ITicketService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { ITicketReassignData } from "../../interface/userTokenData";

export default class TicketService implements ITicketService {
  async createTicketDocument(
    ticketData: ITicket
  ): Promise<{ message: string; success: boolean; statusCode: number; data?: ITicket }> {
    try {
      //create ticket
      const newTicket = await TicketRepository.createTicket(ticketData);
      if (!newTicket) {
        return { message: Messages.DATA_NOT_FOUND, success: false, statusCode: HttpStatus.BAD_REQUEST };
      } else {
        return {
          message: Messages.DATA_CREATED,
          success: true,
          statusCode: HttpStatus.OK,
          data: newTicket,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchAllTickets(
    authUserUUID: string,
    page: number,
    sortBy: string,
    searchQuery: string
  ): Promise<{
    message: string;
    statusCode: number;
    success: boolean;
    data?: { tickets: ITicket[] | null; totalPages: number };
  }> {
    try {
      const result = await TicketRepository.findAllTickets(authUserUUID, page, sortBy, searchQuery);
      if (result) {
        return {
          message: Messages.FETCH_SUCCESS,
          statusCode: HttpStatus.OK,
          success: true,
          data: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getReassignedTicket(data: ITicketReassignData): Promise<IReassignedTicketResponse> {
    try {
      const isExist = await TicketRepository.findOneDocument({ _id: data.ticketId });
      if (!isExist) {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      const update = await TicketRepository.ticketReassign(data);
      return {
        message: Messages.FILE_UPDATED,
        statusCode: HttpStatus.OK,
        success: true,
        data: update,
      };
    } catch (error) {
      throw error;
    }
  }
}
