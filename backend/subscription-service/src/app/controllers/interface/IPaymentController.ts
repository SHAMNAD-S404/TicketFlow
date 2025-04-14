import { Request , Response } from "express";



export interface IPaymentController {
    createStripeSession (req : Request , res : Response ) : Promise<void>
}