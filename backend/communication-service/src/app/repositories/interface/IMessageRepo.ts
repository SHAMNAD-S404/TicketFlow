import IMessage from "../../models/interface/IMessage";


export interface IMessageRepo {    

    createMessage ( data : Partial<IMessage>) : Promise<IMessage>;
    getMessagesByTicketID (ticketID : string) : Promise<IMessage[]>;
}