import IChatRoom from "../../models/interface/IChatRoom";
import ChatRoomModel from "../../models/implements/ChatRoomSchema";
import IChatRoomRepo from "../interface/IChatRoomRepo";

class ChatRoomRepo implements IChatRoomRepo {
  constructor() {}

  async updateWithLastMessage(ticketId: string, message: string, sender: string): Promise<boolean> {
    try {
      const result = await ChatRoomModel.findOneAndUpdate(
        { ticketID: ticketId },
        {
          $set: {
            lastMessage: message,
            lastMessageTimestamp: new Date(),
          },
          $addToSet: { participants: sender },
        },
        { upsert: true, new: true }
      );
      return result ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async findAllChatRooms(): Promise<IChatRoom[] | any> {
    try {
      return await ChatRoomModel.find().sort({ lastMessageTimestamp: -1 });
    } catch (error) {
      throw error;
    }
  }

  async findOneDoc(searchQuery: Record<string, string>): Promise<any> {
    try {
      return await ChatRoomModel.findOne(searchQuery);
    } catch (error) {
      throw error;
    }
  }
}

export default new ChatRoomRepo();
