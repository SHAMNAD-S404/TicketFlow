import IChatRoom from "../../models/interface/IChatRoom";
import ChatRoomModel from "../../models/implements/ChatRoomSchema";
import IChatRoomRepo from "../interface/IChatRoomRepo";

class ChatRoomRepo implements IChatRoomRepo {
  constructor() {}

  async updateWithLastMessage(
    ticketId: string,
    message: string,
    sender: string,
    user1?: string,
    user2?: string
  ): Promise<boolean> {
    const updateData: any = {
      $set: {
        lastMessage: message,
        lastMessageTimestamp: new Date(),
      },
      $addToSet: {
        participants: { $each: [sender] },
      },
    };

    // Add user1 and user2 to participants array if they exist
    if (user1) {
      updateData.$addToSet.participants.$each.push(user1);
    }

    if (user2) {
      updateData.$addToSet.participants.$each.push(user2);
    }

    const result = await ChatRoomModel.findOneAndUpdate({ ticketID: ticketId }, updateData, {
      upsert: true,
      new: true,
    });

    return result ? true : false;
  }

  async findAllChatRooms(participantId: string): Promise<IChatRoom[] | any> {
    return await ChatRoomModel.find({ participants: participantId }).sort({
      lastMessageTimestamp: -1,
    });
  }

  async findOneDoc(searchQuery: Record<string, string>): Promise<any> {
    return await ChatRoomModel.findOne(searchQuery);
  }
}

export default new ChatRoomRepo();
