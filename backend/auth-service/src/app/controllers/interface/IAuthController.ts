import { Request , Response } from "express";

export interface IAuthController {
    registerUser(req:Request,res:Response) : Promise<void>;
    verifyOTP(req:Request,res:Response) : Promise<void>;
    verifyLogin(req:Request,res:Response) : Promise<void>
    verifyEmail(req:Request,res:Response) : Promise<void>
    updateUserPassword(req:Request,res:Response) : Promise<void>;
    fetchUserRole(req:Request,res:Response) : Promise<void>
}