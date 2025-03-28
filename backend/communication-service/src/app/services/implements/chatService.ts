import { fetchMessageRes, IChatService, IMessageData, saveMessageResponse } from "../interface/IChatService";
import messageRepo from "../../repositories/implements/messageRepo";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/httpStatus";

export default class ChatService implements IChatService {

  async saveMessage(data: IMessageData): Promise<saveMessageResponse> {
    try {
      const saveMessg = await messageRepo.createMessage(data);
      if (!saveMessg) {
        return {
          message: Messages.SOMETHING_WENT_WRONG,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      } else {
        return {
          message: Messages.MSSG_SENDED,
          statusCode: HttpStatus.OK,
          success: true,
          data: saveMessg,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchMessage(ticketID: string): Promise<fetchMessageRes> {
    try {
      const getMessages = await messageRepo.getMessagesByTicketID(ticketID);
      console.log(getMessages);
      
      if (getMessages.length === 0) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          success: false,
          message: Messages.DATA_NOT_FOUND,
        };
      } else {
        return {
          message: Messages.DATA_FETCHED,
          statusCode: HttpStatus.OK,
          success: true,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
