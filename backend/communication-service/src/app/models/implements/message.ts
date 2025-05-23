import mongoose, { Schema } from "mongoose";
import IMessage from "../interface/IMessage";

// MONGODB SCHEMA FOR MESSAGES COLLECTION
const MessageSchema: Schema = new Schema<IMessage>(
  {
    ticketID: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>("Messages", MessageSchema);
export default MessageModel;
