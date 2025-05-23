import { Request, Response } from "express";
import { ITicketController } from "../interface/ITicketController";
import { ITicketService } from "../../service/interface/ITicketService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import TicketModel from "../../models/implements/ticket";
import { generateUniqTicketId } from "../../../utils/generate-uniq-ticketId";
import { ITicketReassignData } from "../../interface/userTokenData";
import updateTicketValidation from "../../dtos/normalValidations";
import Roles from "../../../constants/Roles";
import { TicketStatus } from "../../models/interface/ITicketModel";
import {
  authUserUUIDValidation,
  EditTicketFormValidation,
  EmployeesearchInputSchema,
  searchInputSchema,
  TicketFormValidation,
  ticketReassignSchema,
  ticketReopenValidation,
} from "../../dtos/basicValidation";




/**
 * @class TicketController
 * @description Handles incoming requests related to tickets, orchestrating the flow
 * of data between the client and the ticket service layer.
 * @implements {ITicketController}
 */


export class TicketController implements ITicketController {
  /**
   * @type {ITicketService}
   * @description Instance of the ticket service, responsible for ticket-specific business logic.
   */

  private readonly ticketService: ITicketService;

  /**
   * @constructor
   * @param {ITicketService} TicketServcie - The dependency for the ticket service.
   */
  constructor(TicketServcie: ITicketService) {
    this.ticketService = TicketServcie;
  }


//========================= CREATE TICKET ========================================================

  public createTicket = async (req: Request, res: Response): Promise<void> => {
    try {

      //INPUT validation using zod schema
      const validateUUID = authUserUUIDValidation.safeParse(req.query);

      if (!validateUUID.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ALL_FILED_REQUIRED_ERR, success: false });
        return;
      }

      const authUserUUID = validateUUID.data.authUserUUID;

      //INPUT validation using zod schema
      const validateTicketForm = TicketFormValidation.safeParse(req.body);

      if (!validateTicketForm.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_INPUT, success: false });
        return;
      }

      const imageUrl = req.file?.path;
      const ticketID = await generateUniqTicketId();
      // Creating new model for saving ticket data
      const ticketData = new TicketModel({
        authUserUUID,
        ticketID,
        imageUrl,
        ...validateTicketForm.data,
      });

      // delegating to the service layer for create document
      const saveTicket = await this.ticketService.createTicketDocument(ticketData);
      const { message, statusCode, success, data } = saveTicket;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.SERVER_ERROR,
        success: false,
      });
    }
  };

//========================= EDIT TICKET DATA ===============================================

  public editTicket = async (req: Request, res: Response): Promise<void> => {
    try {

      const documentID = req.body.id;
      if (!documentID) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.TICKET_DOC_ID_MISSING,
          success: false,
        });
        return;
      }

      //INPUT validation using zod schema
      const validateEditForm = EditTicketFormValidation.safeParse(req.body);
      if (!validateEditForm.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INVALID_INPUT,
          success: false,
        });
        return;
      }

      const updationData = { ...validateEditForm.data };
      //checking for image url uploaded inthe cloudenory
      if (req.file?.path) {
        updationData.imageUrl = req.file.path;
      }

      // delegating to the service layer for  edit ticket data
      const updateTicket = await this.ticketService.editTicketService(documentID, updationData);
      const { message, statusCode, success } = updateTicket;
      res.status(statusCode).json({ message, success });

    } catch (error) {

      console.error("edit ticket error :", error);
      res.json(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.SERVER_ERROR,
        success: false,
      });
    }
  };

//========================= GET ALL TICKET HANDLING ===============================================

  public getAllTickets = async (req: Request, res: Response): Promise<void> => {
    try {

      //INPUT validation using zod schema
      const validateSearchInput = searchInputSchema.safeParse(req.query);
      if (!validateSearchInput.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }

      const { role, authUserUUID, page, sortBy, searchQuery } = validateSearchInput.data;

      // Authorization check
      if (role !== "company") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      // delegating to the service layer for fetch all tickets
      const result = await this.ticketService.fetchAllTickets(
        authUserUUID,
        page,
        sortBy,
        searchQuery
      );
      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.log("error while getAllTickets", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: Messages.SERVER_ERROR });
    }
  };
  
//========================= TICKET REASSIGN HANDLING =============================================

  public ticketReassign = async (req: Request, res: Response): Promise<void> => {
    try {

      const { role } = req.query;
      // Authorization check
      if (role !== "company") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      //INPUT validation using zod schema
      const ticketValidation = ticketReassignSchema.safeParse(req.body);
      if (!ticketValidation.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ENTER_VALID_INPUT, success: false });
      }
      // Delegating to the service layer for 
      const updateDocument = await this.ticketService.getReassignedTicket(
        ticketValidation.data as ITicketReassignData
      );

      const { message, statusCode, success, data } = updateDocument;
      res.status(statusCode).json({ message, success, data });
      
    } catch (error) {
      
      console.error("error while ticketReassign :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

//========================= FETCH TICKET DOCUMENT  =============================================

  public fetchTicket = async (req: Request, res: Response): Promise<void> => {
    try {

      const { id } = req.query;
      if (!id) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.TICKET_ID_MISSING, success: false });
        return;
      }

      // Delegating to the service layer for get ticcket document
      const getTicket = await this.ticketService.getTicketData(String(id));
      const { message, statusCode, success, data } = getTicket;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= UPDATE TIKCET STATUS DOCS =============================================

  public updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
    try {

      const { id, status, ticketResolutions } = req.body;
      // Input validation
      const validate = updateTicketValidation(id, status, ticketResolutions);
      if (!validate.success) {
        res.status(validate.statusCode as number).json({
          message: validate.message,
          success: validate.success,
        });
        return;
      }

      // Delegating to the service layer for update ticket status
      const updateDoc = await this.ticketService.getUpdatedTicketStatus(
        id,
        status,
        ticketResolutions
      );

      const { message, statusCode, success } = updateDoc;
      res.status(statusCode).json({ message, success });

    } catch (error) {

      console.error("error while updateTicketStatus :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET TICKET EMPLOYEE WISE =============================================

  public getTicketEmployeeWise = async (req: Request, res: Response): Promise<void> => {
    try {

      // Input validation using zod schema
      const validateSearchInput = EmployeesearchInputSchema.safeParse(req.query);
      if (!validateSearchInput.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }

      const { authUserUUID, employeeId, page, role, searchQuery, sortBy } =
        validateSearchInput.data;

      // Authorization check  
      if (role !== Roles.Employee) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      // Delegating to the service layer for fetch all tickets employee wise
      const result = await this.ticketService.fetchAllTicketsEmployeeWise(
        authUserUUID,
        page,
        employeeId,
        sortBy,
        searchQuery
      );

      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });
    } catch (error) {

      console.error("error while getTicketEmployeeWise :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET TICKETS EMPLOYEE RAISED WISE =============================================

  public getTicketEmployeeRaisedWise = async (req: Request, res: Response): Promise<void> => {
    try {

      // Input validation using zod schema
      const validateSearchInput = EmployeesearchInputSchema.safeParse(req.query);
      if (!validateSearchInput.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }

      const { authUserUUID, employeeId, page, searchQuery, sortBy } = validateSearchInput.data;

      // Delegating to the service layer for fetch employee raised tickets
      const result = await this.ticketService.fetchAllTicketEmployeeRaised(
        authUserUUID,
        page,
        employeeId,
        sortBy,
        searchQuery
      );

      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while getTicketEmployeeWise :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= TICKET RE OPEN HANDLING =============================================

  public ticketReOpen = async (req: Request, res: Response): Promise<void> => {
    try {

      // Input validation using zod schema
      const validateInput = ticketReopenValidation.safeParse(req.body);
      if (!validateInput) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INVALID_FILED_OR_MISSING_FIELD,
          success: false,
        });
        return;
      }

      // data for update in ticket document @reopne reason field
      const data = {
        ticketReopenReason: validateInput.data?.reason as string,
        status: TicketStatus.Pending,
      };

      // Delegating to the service layer for  ticket re open status update
      const updateTicket = await this.ticketService.tiketReOpenService(
        validateInput.data?.id as string,
        data
      );

      const { message, statusCode, success } = updateTicket;
      res.status(statusCode).json({ message, success });

    } catch (error) {

      console.error("error while re-open ticket :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET ALL TICKET STATICS  ==================================================

  public fetchAllTicketStatics = async (req: Request, res: Response): Promise<void> => {
    try {

      const { role, authUserUUID } = req.query;
      // Authorization check
      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      // Delegating to the service layer for fetch all ticket statics
      const result = await this.ticketService.getFetchTicketStatics(
        "authUserUUID",
        authUserUUID as string
      );

      const { data, message, statusCode, success } = result;
      res.status(statusCode).json({
        message,
        success,
        data,
      });
    } catch (error) {

      console.error("error while fetchAllTicketStatics :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET MY TICKET STATICS =====================================================

  public fetchMyTicketStatics = async (req: Request, res: Response): Promise<void> => {
    try {

      const { email } = req.query;
      // Delegating to the service layer for fetch my ticket statics
      const result = await this.ticketService.getFetchTicketStatics(
        "ticketRaisedEmployeeEmail",
        email as string
      );
      const { data, message, statusCode, success } = result;
      res.status(statusCode).json({
        message,
        success,
        data,
      });

    } catch (error) {

      console.error("error while fetch my  Ticket progress Statics :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET ASSIGNED TICKET STATICS ====================================================

  public fetchAssignedTicketStatics = async (req: Request, res: Response): Promise<void> => {
    try {

      const { email } = req.query;
      const result = await this.ticketService.getFetchTicketStatics(
        "ticketHandlingEmployeeEmail",
        email as string
      );

      const { data, message, statusCode, success } = result;
      res.status(statusCode).json({
        message,
        success,
        data,
      });

    } catch (error) {
      console.error("error while fetch my  Ticket progress Statics :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET TICKET STATICS FOR DASHBOAD PAGE =============================================

  public getTicketStatsForDashboard = async (req: Request, res: Response): Promise<void> => {
    try {

      const { authUserUUID } = req.query;
      // Delegating to the service layer for fetching ticket statics asynchronously
      const [ticketStatics, resolutionTime] = await Promise.all([
        this.ticketService.getFetchTicketStatics("authUserUUID", authUserUUID as string),
        this.ticketService.getTicketResolutionTime("authUserUUID", authUserUUID as string),
      ]);

      //destructure
      const { data, message, statusCode, success } = ticketStatics;
      res.status(statusCode).json({
        message,
        success,
        data,
        averageResolutionTime: resolutionTime,
      });

    } catch (error) {

      console.error("error while get ticket status for dashboard :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET TICKET STATICS FOR EMPLOYEE SIDE =============================================

  public getTicketStatsForEmployee = async (req: Request, res: Response): Promise<void> => {
    try {

      const { email } = req.query;
       // Delegating to the service layer for fetching ticket statics asynchronously
      const [ticketStatics, resolutionTime] = await Promise.all([
        this.ticketService.getFetchTicketStatics("ticketHandlingEmployeeEmail", email as string),
        this.ticketService.getTicketResolutionTime("ticketHandlingEmployeeEmail", email as string),
      ]);
      //destructure
      const { data, message, statusCode, success } = ticketStatics;
      res.status(statusCode).json({
        message,
        success,
        data,
        averageResolutionTime: resolutionTime,
      });
    } catch (error) {
      console.error("error while get ticket status for dashboard :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET COMPANY DASHBOARD DATA  =============================================

  public getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { authUserUUID } = req.query;
      // Delegating to the service layer for company dashboard data
      const response = await this.ticketService.getCompanyDashboardData(authUserUUID as string);
      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while get ticket status for dashboard :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET EMPLOYEE DAHSBOARD DATA ===============================================

  public getEmployeeDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {

      const { authUserUUID, email } = req.query;
      // Delegating to the service layer for get employee dashboard data
      const response = await this.ticketService.getEmployeeDashboardData(
        email as string,
        authUserUUID as string
      );

      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while get ticket status for dashboard :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= ******************************* =============================================

}
