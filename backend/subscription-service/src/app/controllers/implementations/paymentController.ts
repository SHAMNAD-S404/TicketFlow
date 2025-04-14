import { Request, Response } from "express";
import { IPaymentController } from "../interface/IPaymentController";


export class PaymentController implements IPaymentController {

    constructor () {}

    public createStripeSession = async (req: Request, res: Response): Promise<void>  => {
        try {
            console.log(req.body)
        } catch (error) {
            console.log(error);
            
        }
    }
}