import messageRepo from "../../repositories/implements/messageRepo";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/httpStatus";
import ChatRoomRepo from "../../repositories/implements/ChatRoomRepo";
import {
  fetchMessageRes,
  getAllChatRoomsRes,
  IChatService,
  IMessageData,
} from "../interface/IChatService";


/**
 * @class ChatService
 * @description Implements the core business logic for chat functionalities.
 * This class acts as an intermediary, processing requests from the controller
 * and interacting with data access layers (e.g., repositories) for chat data.
 * @implements {IChatService}
 */
export default class ChatService implements IChatService {

//========================= SAVE MESSAGE ============================================================

  async saveMessage(data: IMessageData): Promise<any> {

    // Delegating to the Repository layer for store message in DB
    const savedMessg = await messageRepo.createMessage(data);

    //update or creating chat room with last message
    const { ticketID, sender, message, user1, user2 } = data;
    // Delegating to the Repository layer for update the last message in document
    await ChatRoomRepo.updateWithLastMessage(ticketID, message, sender, user1, user2);
    return savedMessg;
  }

//========================= GET MESSAGE BY TICKET ID =================================================

  async getMessagesByTicketID(ticketId: string): Promise<fetchMessageRes> {

    // Delegating to the Repository layer for getting all messages doc with ticket id
    const result = await messageRepo.getMessagesByTicketID(ticketId);
    if (result.length > 0) {
      return {
        message: Messages.DATA_FETCHED,
        success: true,
        data: result,
        statusCode: HttpStatus.OK,
      };
    } else {
      return {
        message: Messages.DATA_NOT_FOUND,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

//========================= GET ALL CHAT ROOM =========================================================

  async getAllChatRooms(participantId: string): Promise<getAllChatRoomsRes> {

    // Delegating to the Repository layer for get all chat rooms document from db
    const result = await ChatRoomRepo.findAllChatRooms(participantId);

    if (result.length > 0) {
      return {
        message: Messages.DATA_FETCHED,
        success: true,
        statusCode: HttpStatus.OK,
        data: result,
      };
    } else {
      return {
        message: Messages.DATA_NOT_FOUND,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

//========================= GET A CHAT ROOM BY TICKET ID ================================================

  async getChatRoomByTicketID(ticketID: string): Promise<any> {
    // Delegating to the Repository layer for find one chat room by ticket id
    return await ChatRoomRepo.findOneDoc({ ticketID: ticketID });
  }

//========================= ******************************* ==============================================
}

