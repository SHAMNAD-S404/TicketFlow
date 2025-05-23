import IMessage from "../../models/interface/IMessage";
import { IBasicResponse } from "./BaseResponse";
import IChatRoom from "../../models/interface/IChatRoom";

export interface IMessageData {
  ticketID: string;
  sender: string;
  message: string;
  user1?: string;
  user2?: string;
}

export interface saveMessageResponse extends IBasicResponse {
  data?: IMessage;
}
export interface fetchMessageRes extends IBasicResponse {
  data?: IMessage[] | null;
}

export interface getAllChatRoomsRes extends IBasicResponse {
  data?: IChatRoom[] | null;
}

//========================= INTERFACE FOR CHAT SERVICE ======================================================

export interface IChatService {
  saveMessage           ( data: IMessageData )    : Promise<any>;
  getMessagesByTicketID ( ticketId: string )      : Promise<fetchMessageRes>;
  getAllChatRooms       ( participantId: string ) : Promise<getAllChatRoomsRes>;
  getChatRoomByTicketID ( ticketID: string )      : Promise<any>;
}
