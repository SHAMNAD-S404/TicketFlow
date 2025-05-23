import IMessage from "../../models/interface/IMessage";

//========================= INTERFACE FOR MESSAGE REPOSITORY =======================================================

export interface IMessageRepo {    

    createMessage           ( data : Partial<IMessage>) : Promise<IMessage>;
    getMessagesByTicketID   (ticketID : string) : Promise<IMessage[]>;
}