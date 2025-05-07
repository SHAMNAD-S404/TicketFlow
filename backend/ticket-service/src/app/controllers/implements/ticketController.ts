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
import {
  authUserUUIDValidation,
  EditTicketFormValidation,
  EmployeesearchInputSchema,
  searchInputSchema,
  TicketFormValidation,
  ticketReassignSchema,
  ticketReopenValidation,
} from "../../dtos/basicValidation";
import { TicketStatus } from "../../models/interface/ITicketModel";

export class TicketController implements ITicketController {
  private readonly ticketService: ITicketService;
  constructor(TicketServcie: ITicketService) {
    this.ticketService = TicketServcie;
  }

  public createTicket = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateUUID = authUserUUIDValidation.safeParse(req.query);

      if (!validateUUID.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ALL_FILED_REQUIRED_ERR, success: false });
        return;
      }
      const authUserUUID = validateUUID.data.authUserUUID;

      const validateTicketForm = TicketFormValidation.safeParse(req.body);
      if (!validateTicketForm.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_INPUT, success: false });
        return;
      }

      const imageUrl = req.file?.path;
      const ticketID = await generateUniqTicketId();
      const ticketData = new TicketModel({
        authUserUUID,
        ticketID,
        imageUrl,
        ...validateTicketForm.data,
      });

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

      const validateEditForm = EditTicketFormValidation.safeParse(req.body);
      if (!validateEditForm.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INVALID_INPUT,
          success: false,
        });
        return;
      }

      const updationData = { ...validateEditForm.data };
      if (req.file?.path) {
        updationData.imageUrl = req.file.path;
      }

      const updateTicket = await this.ticketService.editTicketService(documentID, updationData);
      const { message, statusCode, success } = updateTicket;
      res.status(statusCode).json({ message, success });
      return;
    } catch (error) {
      console.error("edit ticket error :", error);
      res.json(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.SERVER_ERROR,
        success: false,
      });
    }
  };

  public getAllTickets = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateSearchInput = searchInputSchema.safeParse(req.query);
      if (!validateSearchInput.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }

      const { role, authUserUUID, page, sortBy, searchQuery } = validateSearchInput.data;

      if (role !== "company") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const result = await this.ticketService.fetchAllTickets(authUserUUID, page, sortBy, searchQuery);
      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });
    } catch (error) {
      console.log("error while getAllTickets", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

  public ticketReassign = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role } = req.query;
      if (role !== "company") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }
      const ticketValidation = ticketReassignSchema.safeParse(req.body);
      if (!ticketValidation.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ENTER_VALID_INPUT, success: false });
      }
      const updateDocument = await this.ticketService.getReassignedTicket(ticketValidation.data as ITicketReassignData);
      const { message, statusCode, success, data } = updateDocument;
      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      console.error("error while ticketReassign :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

  public fetchTicket = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.TICKET_ID_MISSING, success: false });
        return;
      }
      const getTicket = await this.ticketService.getTicketData(String(id));
      const { message, statusCode, success, data } = getTicket;
      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, status, ticketResolutions } = req.body;
      const validate = updateTicketValidation(id, status, ticketResolutions);
      if (!validate.success) {
        res.status(validate.statusCode as number).json({
          message: validate.message,
          success: validate.success,
        });
        return;
      }

      const updateDoc = await this.ticketService.getUpdatedTicketStatus(id, status, ticketResolutions);
      const { message, statusCode, success } = updateDoc;
      res.status(statusCode).json({ message, success });
      return;
    } catch (error) {
      console.error("error while updateTicketStatus :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public getTicketEmployeeWise = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateSearchInput = EmployeesearchInputSchema.safeParse(req.query);
      if (!validateSearchInput.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }

      const { authUserUUID, employeeId, page, role, searchQuery, sortBy } = validateSearchInput.data;
      if (role !== Roles.Employee) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const result = await this.ticketService.fetchAllTicketsEmployeeWise(
        authUserUUID,
        page,
        employeeId,
        sortBy,
        searchQuery
      );

      console.log("test 1 result ;" , result);
      


      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });
    } catch (error) {
      console.error("error while getTicketEmployeeWise :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public getTicketEmployeeRaisedWise = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateSearchInput = EmployeesearchInputSchema.safeParse(req.query);
      if (!validateSearchInput.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }

      const { authUserUUID, employeeId, page, searchQuery, sortBy } = validateSearchInput.data;

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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public ticketReOpen = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateInput = ticketReopenValidation.safeParse(req.body);
      if (!validateInput) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INVALID_FILED_OR_MISSING_FIELD,
          success: false,
        });
        return;
      }

      const data = {
        ticketReopenReason: validateInput.data?.reason as string,
        status: TicketStatus.Pending,
      };
      const updateTicket = await this.ticketService.tiketReOpenService(validateInput.data?.id as string, data);
      const { message, statusCode, success } = updateTicket;
      res.status(statusCode).json({ message, success });
      return;
    } catch (error) {
      console.error("error while re-open ticket :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };


  public fetchAllTicketStatics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, authUserUUID } = req.query;
      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const result = await this.ticketService.getFetchTicketStatics("authUserUUID", authUserUUID as string);
      const { data, message, statusCode, success } = result;
      res.status(statusCode).json({
        message,
        success,
        data,
      });
    } catch (error) {
      console.error("error while fetchAllTicketStatics :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public fetchMyTicketStatics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.query;

      const result = await this.ticketService.getFetchTicketStatics("ticketRaisedEmployeeEmail", email as string);
      const { data, message, statusCode, success } = result;
      res.status(statusCode).json({
        message,
        success,
        data,
      });
    } catch (error) {
      console.error("error while fetch my  Ticket progress Statics :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public fetchAssignedTicketStatics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.query;

      const result = await this.ticketService.getFetchTicketStatics("ticketHandlingEmployeeEmail", email as string);
      const { data, message, statusCode, success } = result;
      res.status(statusCode).json({
        message,
        success,
        data,
      });
    } catch (error) {
      console.error("error while fetch my  Ticket progress Statics :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public getTicketStatsForDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { authUserUUID } = req.query;
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public getTicketStatsForEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.query;
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  }

  public getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
       const {authUserUUID} = req.query;
       const response = await this.ticketService.getCompanyDashboardData(authUserUUID as string)
       const {message,statusCode,success,data} = response;
       res.status(statusCode).json({message,success,data})
    } catch (error) {
      console.error("error while get ticket status for dashboard :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  }

  public getEmployeeDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
      const {authUserUUID ,email} = req.query;
      const response = await this.ticketService.getEmployeeDashboardData(email as string,authUserUUID as string)
      const {message,statusCode,success,data} = response;
      res.status(statusCode).json({message,success,data})
   } catch (error) {
     console.error("error while get ticket status for dashboard :", error);
     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
   }
  }


}
