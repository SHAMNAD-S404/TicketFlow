import { Document } from "mongoose";

interface IMessage extends Document {

    ticketID : string;
    sender  :string;
    message : string;
}

export default IMessage;