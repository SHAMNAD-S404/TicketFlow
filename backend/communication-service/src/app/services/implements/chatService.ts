import {
  fetchMessageRes,
  getAllChatRoomsRes,
  IChatService,
  IMessageData,
  saveMessageResponse,
} from "../interface/IChatService";
import messageRepo from "../../repositories/implements/messageRepo";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/httpStatus";
import ChatRoomRepo from "../../repositories/implements/ChatRoomRepo";

export default class ChatService implements IChatService {
  async saveMessage(data: IMessageData): Promise<any> {
    try {

      const savedMessg = await messageRepo.createMessage(data);

      //update or creating chat room with last message
      const { ticketID, sender, message,user1,user2 } = data;
      const result = await ChatRoomRepo.updateWithLastMessage(ticketID, message, sender,user1,user2);
      return savedMessg;
    } catch (error) {
      throw error;
    }
  }

  async getMessagesByTicketID(ticketId: string): Promise<fetchMessageRes> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getAllChatRooms(participantId: string): Promise<getAllChatRoomsRes> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getChatRoomByTicketID(ticketID: string): Promise<any> {
    try {
      return await ChatRoomRepo.findOneDoc({ ticketID: ticketID });
    } catch (error) {
      throw error;
    }
  }

  // async fetchMessage(ticketID: string): Promise<fetchMessageRes> {
  //   try {
  //     const getMessages = await messageRepo.getMessagesByTicketID(ticketID);
  //     console.log("get messages in comm repo :",getMessages);

  //     if (getMessages.length === 0) {
  //       return {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         success: false,
  //         message: Messages.DATA_NOT_FOUND,
  //       };
  //     } else {
  //       return {
  //         message: Messages.DATA_FETCHED,
  //         statusCode: HttpStatus.OK,
  //         success: true,
  //       };
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
