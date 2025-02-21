import { Request , Response } from "express";

export interface ITicketController {
    createTicket (req:Request , res : Response)  :Promise< void >
}