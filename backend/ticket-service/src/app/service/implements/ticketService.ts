import { ITicket, TicketStatus } from "../../models/interface/ITicketModel";
import TicketRepository from "../../repositories/implements/ticketRepository";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { IBasicResponse, ITicketReassignData } from "../../interface/userTokenData";
import { publishToQueue } from "../../../queues/publisher";
import { RabbitMQConfig } from "../../../config/rabbitMQConfig";
import getResolutionTime from "../../../utils/getResolutionTime";
import ticketShiftReqRepo from "../../repositories/implements/ticketShiftReqRepo";
import {
  AllTicketStaticsResp,
  IDashboardData,
  IfetchAllTicketsEmployeeWise,
  IReassignedTicketResponse,
  ITicketService,
} from "../interface/ITicketService";

export default class TicketService implements ITicketService {
  async createTicketDocument(
    ticketData: ITicket
  ): Promise<{ message: string; success: boolean; statusCode: number; data?: ITicket }> {
    try {
      //create ticket
      console.log("I am ticketData in service :" , ticketData);
    
      
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
          priority: newTicket.priority,
        };
        //send to notification queue to send main to employee email id
        publishToQueue(RabbitMQConfig.notificationQueue, payload);

        //company service employee update payload
        const employeeUpdate = {
          eventType: "employee-ticket-update",
          employeeId: newTicket.ticketHandlingEmployeeId,
          value: 1, //value to determine increase or decrease the ticket 1 for inc -1 decr
        };

        //update ticketcount in employee collection
        publishToQueue(RabbitMQConfig.companyMainQueue, employeeUpdate);

        //communication service payload
        const communicationServicePayload = {
          type: "TICKET_ASSIGNED",
          eventType: "ticket-assigned",
          userId: newTicket.ticketHandlingEmployeeId,
          ticketId: newTicket.ticketID,
          title: "New Ticket Assigned",
          message: `Ticket #${newTicket.ticketID} has been assigned to you by ${newTicket.ticketRaisedEmployeeName}`,
        };

        //publish to commmunication servie
        publishToQueue(RabbitMQConfig.communicationServiceQueue, communicationServicePayload);

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
      if (update) {
        //remove from the shiftreq collection if its there
        ticketShiftReqRepo.deleteOneDocument({ ticketObjectId: data.ticketId });

        //payload for the notification queue
        const payload = {
          type: "ticketAssigned",
          email: update.ticketHandlingEmployeeEmail,
          subject: `Assigned a new Ticket -${update.priority}`,
          template: "ticketTemplate",
          ticketId: update.ticketID,
          employeeName: update.ticketHandlingEmployeeName,
          priority: update.priority,
        };
        //send to notification queue to send main to employee email id
        publishToQueue(RabbitMQConfig.notificationQueue, payload);

        //company service employee update payload
        const employeeUpdate = {
          eventType: "employee-ticket-update",
          employeeId: update.ticketHandlingEmployeeId,
          value: 1, //value to determine increase or decrease the ticket 1 for inc -1 decr
        };

        //update ticketcount in employee collection
        publishToQueue(RabbitMQConfig.companyMainQueue, employeeUpdate);

        //company service employee ticket count reduct payload
        const updateEmployeeData = {
          eventType: "employee-ticket-update",
          employeeId: isExist.ticketHandlingEmployeeId,
          value: -1, //decreasing the ticket count by 1.
        };
        //update reduced ticketcount in employee collection
        publishToQueue(RabbitMQConfig.companyMainQueue, updateEmployeeData);
      }
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

  async getUpdatedTicketStatus(
    id: string,
    status: string,
    ticketResolutions?: string
  ): Promise<IReassignedTicketResponse> {
    try {
      let updateDoc;

      if (status === TicketStatus.Resolved) {
        const ticketData = await TicketRepository.findOneDocument({ _id: id });
        const createdDate = new Date(ticketData?.createdAt as string).toLocaleString();
        const date = new Date().toLocaleString();
        // to calculate the ticket resolution time
        const findResolutionTime = getResolutionTime(createdDate, date);
        updateDoc = await TicketRepository.updateOnTicketClose({
          id,
          status,
          ticketResolutions: ticketResolutions as string,
          ticketClosedDate: date,
          resolutionTime: findResolutionTime,
        });
      } else {
        updateDoc = await TicketRepository.findAndupdateStatus(id, status, ticketResolutions);
      }

      if (updateDoc) {
        if (status === TicketStatus.Resolved) {
          //payload to send to data to notification queue
          const payload = {
            type: "ticketClosed",
            email: updateDoc.ticketRaisedEmployeeEmail,
            subject: ` Your Ticket resolved `,
            template: "ticketClosedTemplate",
            ticketId: updateDoc.ticketID,
            employeeName: updateDoc.ticketRaisedEmployeeName,
            closedDate: updateDoc.ticketClosedDate,
            resolutionTime: updateDoc.resolutionTime,
          };
          //publishing event to notification que to send email
          publishToQueue(RabbitMQConfig.notificationQueue, payload);

          //send data to company service to reduce ticket count of employee
          const employeeUpdate = {
            eventType: "employee-ticket-update",
            employeeId: updateDoc.ticketHandlingEmployeeId,
            value: -1,
          };
          //reduce ticketcount in employee collection
          publishToQueue(RabbitMQConfig.companyMainQueue, employeeUpdate);

          //payload for the communication service notification
          const communicationServicePayload = {
            type: "TICKET_STATUS_CHANGED",
            eventType: "ticket-status-changed",
            userId: updateDoc.ticketRaisedEmployeeId,
            ticketId: updateDoc.ticketID,
            title: "Ticket Status Updated",
            message: `Ticket #${updateDoc.ticketID} status has been changed to ${updateDoc.status} `,
          };

          //publish to communication service
          publishToQueue(RabbitMQConfig.communicationServiceQueue, communicationServicePayload);
        }
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

  async fetchAllTicketEmployeeRaised(
    authUserUUID: string,
    page: number,
    ticketRaisedEmployeeId: string,
    sortBy: string,
    searchQuery: string
  ): Promise<IfetchAllTicketsEmployeeWise> {
    try {
      const result = await TicketRepository.findAllTicketsForEmployeeRaised({
        authUserUUID,
        ticketRaisedEmployeeId,
        page,
        sortBy,
        searchQuery,
      });
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

  async editTicketService(id: string, data: Record<string, string>): Promise<IReassignedTicketResponse> {
    try {
      const ticketExist = await TicketRepository.findOneDocument({ _id: id });
      if (!ticketExist) {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      const updateTicket = await TicketRepository.editTicketRepo(id, data);
      if (!updateTicket) {
        return {
          message: Messages.UPDATE_FAILED,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

      //release ticket count from old ticket handler
      const payload1 = {
        eventType: "employee-ticket-update",
        employeeId: ticketExist.ticketHandlingEmployeeId,
        value: -1, //decrease ticket count by one
      };
      publishToQueue(RabbitMQConfig.companyMainQueue, payload1);

      //increase ticket count for new ticket handler
      const payload2 = {
        eventType: "employee-ticket-update",
        employeeId: updateTicket.ticketHandlingEmployeeId,
        value: 1, //decrease ticket count by one
      };
      publishToQueue(RabbitMQConfig.companyMainQueue, payload2);

      //send email notificatoin to new ticket handler
      const payload3 = {
        type: "ticketAssigned",
        email: updateTicket.ticketHandlingEmployeeEmail,
        subject: `Assigned a new Ticket -${updateTicket.priority}`,
        template: "ticketTemplate",
        ticketId: updateTicket.ticketID,
        employeeName: updateTicket.ticketHandlingEmployeeName,
        priority: updateTicket.priority,
      };
      publishToQueue(RabbitMQConfig.notificationQueue, payload3);

      return {
        message: Messages.FILE_UPDATED,
        statusCode: HttpStatus.OK,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async tiketReOpenService(id: string, data: Record<string, string>): Promise<IBasicResponse> {
    try {
      const isExist = await TicketRepository.findOneDocument({ _id: id });
      if (!isExist) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      if (isExist.status !== TicketStatus.Resolved) {
        return {
          message: Messages.REOPEN_TICKET,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

      const updateTicket = await TicketRepository.editTicketRepo(id, data);
      if (!updateTicket) {
        return {
          message: Messages.SOMETHING_WRONG,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      return {
        message: Messages.REOPEN_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFetchTicketStatics(fieldName: string, fieldValue: string): Promise<AllTicketStaticsResp> {
    try {
      const filter = { [fieldName]: fieldValue };
      const [totalTickets, openTickets, closedTickets, highPriorityTickets] = await Promise.all([
        TicketRepository.getDocumentCount(filter),
        TicketRepository.getDocumentCount({ ...filter, status: { $ne: "resolved" } }),
        TicketRepository.getDocumentCount({ ...filter, status: "resolved" }),
        TicketRepository.getDocumentCount({ ...filter, priority: "High priority" }),
      ]);

      return {
        message: Messages.FETCH_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        data: {
          closedTickets,
          highPriorityTickets,
          openTickets,
          totalTickets,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //get the avg ticket resolution time
  async getTicketResolutionTime(fieldName: string, fieldValue: string): Promise<string> {
    return await TicketRepository.getAverageResolutionTime(fieldName, fieldValue);
  }

  async getCompanyDashboardData(authUserUUID: string): Promise<IDashboardData> {
    try {
      const status = ["pending", "in-progress", "re-opened"];

      const [ticketCountByStatus, ticketsCountByDepartment, ticketCountByPrioriy, topEmployee, topDepartment] =
        await Promise.all([
          TicketRepository.getDynamicTicketStatusCounts("authUserUUID", authUserUUID, status),
          TicketRepository.getDepartmentTicketCounts("authUserUUID", authUserUUID),
          TicketRepository.getUnResolvedTicketsByPriority("authUserUUID", authUserUUID),
          TicketRepository.getTopGroupCount("authUserUUID", authUserUUID, "ticketHandlingEmployeeName"),
          TicketRepository.getTopGroupCount("authUserUUID", authUserUUID, "ticketHandlingDepartmentName"),
        ]);

      return {
        message: Messages.FETCH_SUCCESS,
        success: true,
        statusCode: HttpStatus.OK,
        data: {
          ticketCountByPrioriy,
          ticketCountByStatus,
          ticketsCountByDepartment,
          topEmployee,
          topDepartment,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeDashboardData(email: string, authUserUUID: string): Promise<IDashboardData> {
    try {
      const status = ["pending", "in-progress", "re-opened"];

      const [ticketCountByStatus, ticketsCountByDepartment, ticketCountByPrioriy, topEmployee, topDepartment] =
        await Promise.all([
          TicketRepository.getDynamicTicketStatusCounts("ticketHandlingEmployeeEmail", email, status),
          TicketRepository.getDepartmentTicketCounts("authUserUUID", authUserUUID),
          TicketRepository.getUnResolvedTicketsByPriority("ticketHandlingEmployeeEmail", email),
          TicketRepository.getTopGroupCount("authUserUUID", authUserUUID, "ticketHandlingEmployeeName"),
          TicketRepository.getTopGroupCount("authUserUUID", authUserUUID, "ticketHandlingDepartmentName"),
        ]);

      return {
        message: Messages.FETCH_SUCCESS,
        success: true,
        statusCode: HttpStatus.OK,
        data: {
          ticketCountByPrioriy,
          ticketCountByStatus,
          ticketsCountByDepartment,
          topEmployee,
          topDepartment,
        },
      };
    } catch (error) {
      throw error;
    }
  }

}
