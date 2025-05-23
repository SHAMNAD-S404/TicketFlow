import   { Request , Response  } from "express";

//========================= INTERFACE FOR CHAT CONTROLLER =============================================
export interface IChatController {
    getMessagesByTicketID   ( req : Request ,res : Response ) : Promise<void>;
    getAllChatRooms         ( req : Request ,res : Response ) : Promise<void>;
}