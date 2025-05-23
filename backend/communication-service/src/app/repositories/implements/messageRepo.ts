import IMessage from "../../models/interface/IMessage";
import MessageModel from "../../models/implements/message";
import { IMessageRepo } from "../interface/IMessageRepo";

class MessageRepository implements IMessageRepo {
  constructor() {}

  async createMessage(data: Partial<IMessage>): Promise<IMessage> {
    const newMessage = new MessageModel(data);
    return newMessage.save();
  }

  async getMessagesByTicketID(ticketID: string): Promise<IMessage[]> {
    return MessageModel.find({ ticketID }).sort({ timestamp: 1 });
  }
}

export default new MessageRepository();
