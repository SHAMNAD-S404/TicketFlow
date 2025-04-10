import { Document } from "mongoose";

interface IMessage extends Document {

    ticketID : string;
    sender  :string;
    message : string;
    timestamp : Date;
}

export default IMessage;