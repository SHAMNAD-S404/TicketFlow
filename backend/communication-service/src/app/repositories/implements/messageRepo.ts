import IMessage from "../../models/interface/IMessage";
import MessageModel from "../../models/implements/message";
import { IMessageRepo } from "../interface/IMessageRepo";


class MessageRepository implements IMessageRepo {
  constructor() {}

  async createMessage(data: Partial<IMessage>): Promise<IMessage> {
    try {
      const newMessage = new MessageModel(data);
      return newMessage.save();
    } catch (error) {
      throw error;
    }
  }

  async getMessagesByTicketID(ticketID: string): Promise<IMessage[]> {
    try {
      return MessageModel.find({ ticketID }).sort({ timestamp: 1 });
    } catch (error) {
      throw error;
    }
  }
}

export default new MessageRepository();
