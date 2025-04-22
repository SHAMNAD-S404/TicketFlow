// Define interfaces
export interface IMessage {
    _id: string;
    ticketID: string;
    sender: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IChatRoom {
    _id: string;
    ticketID: string;
    participants: string[];
    lastMessage: string;
    lastMessageTimestamp: Date;
    createdAt: Date;
    updatedAt: Date;
  }