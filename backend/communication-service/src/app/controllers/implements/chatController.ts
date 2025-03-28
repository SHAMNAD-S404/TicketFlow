import { Request, Response } from "express";
import { IChatService } from "../../services/interface/IChatService";
import { IChatController } from "../interface/IChatController";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";

export class ChatController implements IChatController {
  private readonly chatService: IChatService;

  constructor(ChatService: IChatService) {
    this.chatService = ChatService;
  }

  public getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ticketID } = req.query;
      if (!ticketID) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INPUT_INVALID_OR_FIELD_MISSING,
          success: false,
        });
        return;
      }
      const messages = await this.chatService.fetchMessage(ticketID as string);
      const {message,statusCode,success,data} = messages
      res.status(statusCode).json({message,success,data})
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SERVER_ERROR });
    }
  };
}
