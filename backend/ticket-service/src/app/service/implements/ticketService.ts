import { ITicket } from "../../models/interface/ITicketModel";
import TicketRepository from "../../repositories/implements/ticketRepository";
import { IfetchAllTicketsEmployeeWise, IReassignedTicketResponse, ITicketService } from "../interface/ITicketService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { ITicketReassignData } from "../../interface/userTokenData";
import { publishToQueue } from "../../../queues/publisher";
import { RabbitMQConfig } from "../../../config/rabbitMQConfig";

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
        //payload for sending to notification queue
        const payload = {
          type: "ticketAssigned",
          email: newTicket.ticketHandlingEmployeeEmail,
          subject: `Assigned a new Ticket -${newTicket.priority}`,
          template: "ticketTemplate",
          ticketId: newTicket.ticketID,
          employeeName: newTicket.ticketHandlingEmployeeName,
        };
        //send to notification queue
        publishToQueue(RabbitMQConfig.notificationQueue, payload);

        //company service employee update payload
        const employeeUpdate = {
          eventType: "employee-ticket-update",
          employeeId: newTicket.ticketHandlingEmployeeId,
          value: 1,
        };

        //update ticketcount in employee collection
        publishToQueue(RabbitMQConfig.companyMainQueue, employeeUpdate);

        return {
          message: Messages.TICKET_CREATED,
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
        message: Messages.TICKET_REASSIGNED,
        statusCode: HttpStatus.OK,
        success: true,
        data: update,
      };
    } catch (error) {
      throw error;
    }
  }

  async getTicketData(id: string): Promise<IReassignedTicketResponse> {
    try {
      const getData = await TicketRepository.findOneWithSingleField({ _id: id });
      if (getData) {
        return {
          message: Messages.FETCH_SUCCESS,
          statusCode: HttpStatus.OK,
          success: true,
          data: getData,
        };
      } else {
        return {
          message: Messages.TICKET_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getUpdatedTicketStatus(id: string, status: string,ticketResolutions?:string): Promise<IReassignedTicketResponse> {
    try {
      const updateDoc = await TicketRepository.findAndupdateStatus(id, status,ticketResolutions);
      if (updateDoc) {
        return {
          message: Messages.TICKET_STATUS_UPDATED,
          statusCode: HttpStatus.OK,
          success: true,
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

  async fetchAllTicketsEmployeeWise(
    authUserUUID: string,
    page: number,
    ticketHandlingEmployeeId: string,
    sortBy: string,
    searchQuery: string
  ): Promise<IfetchAllTicketsEmployeeWise> {
    try {
      const result = await TicketRepository.findAllTicketForEmployee(
        authUserUUID,
        ticketHandlingEmployeeId,
        page,
        sortBy,
        searchQuery
      );
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
}
