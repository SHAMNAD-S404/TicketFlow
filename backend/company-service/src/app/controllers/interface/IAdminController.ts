import { Request,Response } from "express";

export interface IAdminController {
    getUserData(req:Request,res:Response) :  Promise<void>;
   
    
}