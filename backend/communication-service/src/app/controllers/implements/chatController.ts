import { Request, Response } from "express";
import { IChatService } from "../../services/interface/IChatService";
import { IChatController } from "../interface/IChatController";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";

/**
 * @class ChatController
 * @description Handles incoming chat-related requests and orchestrates the flow
 * of data between the client and the chat service layer.
 * @implements {IChatController}
 */
export class ChatController implements IChatController {
  /**
   * @type {IChatService}
   * @description An instance of the chat service responsible for business logic.
   */
  private readonly chatService: IChatService;
  /**
   * @constructor
   * @param {IChatService} ChatService - The dependency for the chat service.
   */
  constructor(ChatService: IChatService) {
    this.chatService = ChatService;
  }

  //========================= GET MESSAGE BY TICKET  ID ======================================================

  public getMessagesByTicketID = async (req: Request, res: Response): Promise<void> => {

    try {
      const { ticketID } = req.query;
      if (!ticketID) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INPUT_INVALID_OR_FIELD_MISSING,
          success: false,
        });
        return;
      }
      // Delegating to the service layer for getting messages with ticket id
      const messages = await this.chatService.getMessagesByTicketID(ticketID as string);
      const { message, statusCode, success, data } = messages;
      res.status(statusCode).json({ message, success, data });
    } catch (error) {
      console.log("error while fetching messsg", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

  //========================= GET ALL CHAT ROOMS ======================================================

  public getAllChatRooms = async (req: Request, res: Response): Promise<void> => {
    try {
      const { participantsId } = req.query;
      if (!participantsId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.PARTICIPIANTS_ID_MISSING,
          success: false,
        });
        return;
      }
      const chatRooms = await this.chatService.getAllChatRooms(participantsId as string);
      const { message, statusCode, success, data } = chatRooms;
      res.status(statusCode).json({ message, success, data });
    } catch (error) {
      console.log("error while fetching getAllrooms :", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

  //========================= ********************************* ======================================================
}
