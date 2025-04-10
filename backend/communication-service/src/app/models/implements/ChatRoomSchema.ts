import mongoose, { Schema, Document } from "mongoose";
import IChatRoom from "../interface/IChatRoom";

const ChatRoomSchema: Schema = new Schema<IChatRoom>(
  {
    ticketID: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: String,
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTimestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const ChatRoomModel = mongoose.model<IChatRoom & Document>("ChatRoom", ChatRoomSchema);
export default ChatRoomModel;
