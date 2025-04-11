import   { Request , Response  } from "express";

export interface IChatController {
    getMessagesByTicketID (req : Request , res : Response) : Promise<void>;
    getAllChatRooms ( req:Request , res : Response) : Promise<void>;
}