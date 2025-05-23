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
  CreateTicketResponse,
  IDashboardData,
  IfetchAllTicketsEmployeeWise,
  IReassignedTicketResponse,
  ITicketService,
} from "../interface/ITicketService";



/**
 * @class TicketService
 * @description Implements the core business logic for managing ticket-related operations.
 * This service processes requests from controllers and interacts with data access layers
 * (e.g., repositories) for ticket data persistence and retrieval.
 * @implements {ITicketService}
 */

export default class TicketService implements ITicketService {


//========================= CREATE TICKET DOCUMENT ===============================================

  async createTicketDocument(
    ticketData: ITicket
  ): Promise<CreateTicketResponse> {

      // Delegating to the service layer for create ticket
      const newTicket = await TicketRepository.createTicket(ticketData);

      if (!newTicket) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };

      } else {

        //payload for sending to notification queue using rabbitmq
        const payload = {
          type: "ticketAssigned",
          email: newTicket.ticketHandlingEmployeeEmail,
          subject: `Assigned a new Ticket -${newTicket.priority}`,
          template: "ticketTemplate",
          ticketId: newTicket.ticketID,
          employeeName: newTicket.ticketHandlingEmployeeName,
          priority: newTicket.priority,
        };
        
        // send to notification queue for send emails to employee email
        publishToQueue(RabbitMQConfig.notificationQueue, payload);

        // Payload for the company service for updation employee document
        const employeeUpdate = {
          eventType: "employee-ticket-update",
          employeeId: newTicket.ticketHandlingEmployeeId,
          value: 1, //value to determine increase or decrease the ticket 1 for inc -1 decr
        };

        // sending to company queue using rabbitmq for update ticketcount in employee collection
        publishToQueue(RabbitMQConfig.companyMainQueue, employeeUpdate);

        // Payload for communication service to get In App notification
        const communicationServicePayload = {
          type: "TICKET_ASSIGNED",
          eventType: "ticket-assigned",
          userId: newTicket.ticketHandlingEmployeeId,
          ticketId: newTicket.ticketID,
          title: "New Ticket Assigned",
          message: `Ticket #${newTicket.ticketID} has been assigned to you by ${newTicket.ticketRaisedEmployeeName}`,
        };

        //publish to commmunication servie using rabbitmq for in app notiifcations
        publishToQueue(RabbitMQConfig.communicationServiceQueue, communicationServicePayload);

        return {
          message: Messages.TICKET_CREATED,
          success: true,
          statusCode: HttpStatus.OK,
          data: newTicket,
        };
      }
  }

//========================= FETCH ALL TICKETS DOCUMENT ===================================================


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

      // Delegating to the service layer for find all ticket docs
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
  }

//========================= RE ASSIGN TICKET =============================================================


  async getReassignedTicket(data: ITicketReassignData): Promise<IReassignedTicketResponse> {
    
      const isExist = await TicketRepository.findOneDocument({ _id: data.ticketId });

      if (!isExist) {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

      // Delegating to the service layer for update ticket document
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

        // send to notification queue to send email to the ticket assigned  employee email to let they know
        publishToQueue(RabbitMQConfig.notificationQueue, payload);

        // Payload for company service to increase employee live ticket count
        const employeeUpdate = {
          eventType: "employee-ticket-update",
          employeeId: update.ticketHandlingEmployeeId,
          value: 1, // value to determine increase or decrease the ticket 1 for inc -1 decrement
        };

        // sending to the company service to update ticketcount in employee collection.
        publishToQueue(RabbitMQConfig.companyMainQueue, employeeUpdate);

        // Payload for company service to decrease employee live ticket count
        const updateEmployeeData = {
          eventType: "employee-ticket-update",
          employeeId: isExist.ticketHandlingEmployeeId,
          value: -1, // decreasing the ticket count by 1.
        };

        // sending to the company service to update ticketcount in employee collection.
        publishToQueue(RabbitMQConfig.companyMainQueue, updateEmployeeData);

      }

      return {
        message: Messages.TICKET_REASSIGNED,
        statusCode: HttpStatus.OK,
        success: true,
        data: update,
      };
  }

//========================= GET TICKET DOCUMENT ===============================================================

  async getTicketData(id: string): Promise<IReassignedTicketResponse> {

      // Delegating to the service layer for find a document
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
  }

//========================= UPDATE TICKET STATUS ==============================================================

  async getUpdatedTicketStatus(
    id: string,
    status: string,
    ticketResolutions?: string
  ): Promise<IReassignedTicketResponse> {
    
      let updateDoc;

      // If Ticket is resolved 
      if (status === TicketStatus.Resolved) {

        const ticketData = await TicketRepository.findOneDocument({ _id: id });
        const createdDate = new Date(ticketData?.createdAt as string).toLocaleString();
        const date = new Date().toLocaleString();

        // to calculate the ticket resolution time
        const findResolutionTime = getResolutionTime(createdDate, date);
        // Delegating to the service layer for  update ticket document
        updateDoc = await TicketRepository.updateOnTicketClose({
          id,
          status,
          ticketResolutions: ticketResolutions as string,
          ticketClosedDate: date,
          resolutionTime: findResolutionTime,
        });

      } else {
        // if ticket status is different one , update the ticket document
        updateDoc = await TicketRepository.findAndupdateStatus(id, status, ticketResolutions);
      }


      if (updateDoc) {
        if (status === TicketStatus.Resolved) {

          // payload to send to data to notification queue
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

          // publishing event to notification que to send email to ticket raised employee to let them know about the status
          publishToQueue(RabbitMQConfig.notificationQueue, payload);

          //send data to company service to decrease ticket count of employee
          const employeeUpdate = {
            eventType: "employee-ticket-update",
            employeeId: updateDoc.ticketHandlingEmployeeId,
            value: -1,
          };

          // sending to the company service to update ticketcount in employee collection.
          publishToQueue(RabbitMQConfig.companyMainQueue, employeeUpdate);

          // payload for the communication service for the in app notification
          const communicationServicePayload = {
            type: "TICKET_STATUS_CHANGED",
            eventType: "ticket-status-changed",
            userId: updateDoc.ticketRaisedEmployeeId,
            ticketId: updateDoc.ticketID,
            title: "Ticket Status Updated",
            message: `Ticket #${updateDoc.ticketID} status has been changed to ${updateDoc.status} `,
          };

          // publish to communication service for in app notification
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
  }

//========================= FETCH ALL TICKETS EMPLOYEE WISE ============================================

  async fetchAllTicketsEmployeeWise(
    authUserUUID: string,
    page: number,
    ticketHandlingEmployeeId: string,
    sortBy: string,
    searchQuery: string
  ): Promise<IfetchAllTicketsEmployeeWise> {

      // Delegating to the service layer for  find documents
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
  }

//========================= FETCH ALL TICKETS BY EMPLOYEE RAISED ID =====================================

  async fetchAllTicketEmployeeRaised(
    authUserUUID: string,
    page: number,
    ticketRaisedEmployeeId: string,
    sortBy: string,
    searchQuery: string
  ): Promise<IfetchAllTicketsEmployeeWise> {

      // Delegating to the service layer for  find documents
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
  }

//========================= EDIT TICKET DOCUMENT ===================================================

  async editTicketService(
    id: string,
    data: Record<string, string>
  ): Promise<IReassignedTicketResponse> {
    
      const ticketExist = await TicketRepository.findOneDocument({ _id: id });

      if (!ticketExist) {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

      // Delegating to the service layer for  edit ticket
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

      // sending to company queue for updating employee document 
      publishToQueue(RabbitMQConfig.companyMainQueue, payload1);

      //increase ticket count for new ticket handler
      const payload2 = {
        eventType: "employee-ticket-update",
        employeeId: updateTicket.ticketHandlingEmployeeId,
        value: 1, //decrease ticket count by one
      };

      // sending to company queue for updating employee document 
      publishToQueue(RabbitMQConfig.companyMainQueue, payload2);

      // Payload for send email notificatoin to new ticket handler
      const payload3 = {
        type: "ticketAssigned",
        email: updateTicket.ticketHandlingEmployeeEmail,
        subject: `Assigned a new Ticket -${updateTicket.priority}`,
        template: "ticketTemplate",
        ticketId: updateTicket.ticketID,
        employeeName: updateTicket.ticketHandlingEmployeeName,
        priority: updateTicket.priority,
      };
      
      // sending to the notification queue for sending email to the ticket handler
      publishToQueue(RabbitMQConfig.notificationQueue, payload3);

      return {
        message: Messages.FILE_UPDATED,
        statusCode: HttpStatus.OK,
        success: true,
      };
  }

//========================= TICKET RE OPEN HANDLING =================================================

  async tiketReOpenService(id: string, data: Record<string, string>): Promise<IBasicResponse> {
    
      const isExist = await TicketRepository.findOneDocument({ _id: id });
      if (!isExist) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      
      // Resolved tickets only can able to re open
      if (isExist.status !== TicketStatus.Resolved) {
        return {
          message: Messages.REOPEN_TICKET,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

      // Delegating to the service layer for update document
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
  }

//========================= GET TICKET STATICS ========================================================

  async getFetchTicketStatics(
    fieldName: string,
    fieldValue: string
  ): Promise<AllTicketStaticsResp> {
    
      const filter = { [fieldName]: fieldValue };
      // Delegating to the service layer for get ticket statics asychronously
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
  }

//========================= GET AVERAGE TICKET RESOLUTION TIME ==========================================

  async getTicketResolutionTime(fieldName: string, fieldValue: string): Promise<string> {
    return await TicketRepository.getAverageResolutionTime(fieldName, fieldValue);
  }

//========================= GET COMPANY DASHBOARD DATA ==================================================

  async getCompanyDashboardData(authUserUUID: string): Promise<IDashboardData> {
    
      const status = ["pending", "in-progress", "re-opened"];

      // Delegating to the service layer for getting  ticket statics for comapny dashboard
      const [
        ticketCountByStatus,
        ticketsCountByDepartment,
        ticketCountByPrioriy,
        topEmployee,
        topDepartment,
      ] = await Promise.all([
        TicketRepository.getDynamicTicketStatusCounts("authUserUUID", authUserUUID, status),
        TicketRepository.getDepartmentTicketCounts("authUserUUID", authUserUUID),
        TicketRepository.getUnResolvedTicketsByPriority("authUserUUID", authUserUUID),
        TicketRepository.getTopGroupCount(
          "authUserUUID",
          authUserUUID,
          "ticketHandlingEmployeeName"
        ),
        TicketRepository.getTopGroupCount(
          "authUserUUID",
          authUserUUID,
          "ticketHandlingDepartmentName"
        ),
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
  }

//========================= GET EMPLOYEE DASHBOARD DATA ==================================================

  async getEmployeeDashboardData(email: string, authUserUUID: string): Promise<IDashboardData> {
    
      const status = ["pending", "in-progress", "re-opened"];

      const [
        ticketCountByStatus,
        ticketsCountByDepartment,
        ticketCountByPrioriy,
        topEmployee,
        topDepartment,

      ] = await Promise.all([
        TicketRepository.getDynamicTicketStatusCounts("ticketHandlingEmployeeEmail", email, status),
        TicketRepository.getDepartmentTicketCounts("authUserUUID", authUserUUID),
        TicketRepository.getUnResolvedTicketsByPriority("ticketHandlingEmployeeEmail", email),
        TicketRepository.getTopGroupCount(
          "authUserUUID",
          authUserUUID,
          "ticketHandlingEmployeeName"
        ),
        TicketRepository.getTopGroupCount(
          "authUserUUID",
          authUserUUID,
          "ticketHandlingDepartmentName"
        ),
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
  }

//========================= ******************************************** ====================================

}
