import IMessage from "../../models/interface/IMessage";
import { IBasicResponse } from "./BaseResponse";

export interface IMessageData {
  ticketID: string;
  sender: string;
  message: string;
}

export interface saveMessageResponse extends IBasicResponse {
  data?: IMessage;
}
export interface fetchMessageRes extends IBasicResponse {
  data?: IMessage[] | null;
}

export interface IChatService {
  saveMessage(data: IMessageData): Promise<saveMessageResponse>;
  getMessagesByTicketID(ticketId : string) : Promise<fetchMessageRes>
  getAllChatRooms() : Promise<any[]>
  getChatRoomByTicketID(ticketID : string) : Promise<any>
}
