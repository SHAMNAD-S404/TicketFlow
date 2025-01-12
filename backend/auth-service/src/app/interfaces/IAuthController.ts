import { Request , Response } from "express";

export interface IAuthController {
    registerUser(req:Request,res:Response) : Promise<void>;
}