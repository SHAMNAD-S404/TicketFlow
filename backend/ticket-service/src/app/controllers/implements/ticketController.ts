import { Request, Response } from "express";
import { ITicketController } from "../interface/ITicketController";
import { ITicketService } from "../../service/interface/ITicketService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import TicketModel from "../../models/implements/ticket";
import { generateUniqTicketId } from "../../../queues/generate-uniq-ticketId";
import { ITicketReassignData } from "../../interface/userTokenData";
import {
  authUserUUIDValidation,
  searchInputSchema,
  TicketFormValidation,
  ticketReassignSchema,
} from "../../dtos/basicValidation";

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
      res.status(statusCode).json({
        message,
        success,
        statusCode,
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
        res.status(HttpStatus.FORBIDDEN).json({ message: Messages.ENTER_VALID_INPUT, success: false });
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
        res.status(HttpStatus.FORBIDDEN).json({ message: Messages.TICKET_ID_MISSING, success: false });
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

  public updateTicketStatus = async (req: Request, res: Response): Promise<void>  => {
    try {
      const {id,status} = req.body;
      if(!id || !status){
        res.status(HttpStatus.BAD_REQUEST).json({message:Messages.REQUIRED_FIELD_MISSING,success:false})
        return
      }
      const ticketStatus: string[] = ["pending", "in-progress", "resolved", "closed", "re-opened"];
      if( !ticketStatus.includes(status) ){
        res.status(HttpStatus.BAD_REQUEST).json({message:Messages.ENTER_VALID_INPUT,success:false});
        return;
      }

      const updateDoc = await this.ticketService.getUpdatedTicketStatus(id,status);
      const {message,statusCode,success} = updateDoc;
      res.status(statusCode).json({message,success});
      return;
      
    } catch (error) {
      console.error("error while updateTicketStatus :",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:Messages.SERVER_ERROR,success:false})
    }
  }



}
