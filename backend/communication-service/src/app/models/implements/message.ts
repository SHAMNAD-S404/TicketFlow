import mongoose, { Schema, Document } from "mongoose";
import IMessage from "../interface/IMessage";

const messageSchema: Schema = new Schema<IMessage>(
  {
    ticketID: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage & Document>("messages", messageSchema);
export default MessageModel;
