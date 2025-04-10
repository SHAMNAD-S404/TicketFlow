import mongoose, { Schema, Document } from "mongoose";
import IMessage from "../interface/IMessage";

const MessageSchema: Schema = new Schema<IMessage>(
  {
    ticketID: {
      type: String,
      required: true,
      index : true,
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp : {
      type : Date,
      default : Date.now(),
    }
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage & Document>("Messages", MessageSchema);
export default MessageModel;
