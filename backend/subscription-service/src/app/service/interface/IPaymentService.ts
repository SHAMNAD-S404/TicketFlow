import Stripe from "stripe";
import { CreateCheckoutDTO } from "../../dtos/paymentDto";
import { IPayment } from "../../models/interface/IPayment";

export interface IBaseResponse {
    message : string,
    success : boolean;
    statusCode : number;
}

export interface orderDetailsResponse extends IBaseResponse{
    data ? : IPayment
}




export interface IPaymentService {
    createCheckoutSession ( data : CreateCheckoutDTO ) : Promise<any>
    handleSuccessfulPayment(session : Stripe.Checkout.Session) : Promise<IBaseResponse>
    getOrderDetailsService (sessionId : string) : Promise<orderDetailsResponse>
}