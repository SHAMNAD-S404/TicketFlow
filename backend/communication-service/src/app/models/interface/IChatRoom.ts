import { Document } from 'mongoose';

interface IChatRoom extends Document {
    ticketID : string;
    participants : string[];
    lastMessage : string;
    lastMessageTimestamp : Date;
}

export default IChatRoom;