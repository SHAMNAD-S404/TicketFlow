import { Request, Response } from "express";

export interface IShiftRequestController {
  createRequest   (req: Request, res : Response)    : Promise<void>;
  getAllRequests  (req : Request , res : Response) : Promise<void>;
  rejectRequest   (req:Request , res : Response)   : Promise<void>
}
