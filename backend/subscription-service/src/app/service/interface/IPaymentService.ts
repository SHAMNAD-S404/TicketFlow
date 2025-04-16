import Stripe from "stripe";
import { CreateCheckoutDTO } from "../../dtos/paymentDto";

export interface IBaseResponse {
    message : string,
    success : boolean;
    statusCode : number;
}




export interface IPaymentService {
    createCheckoutSession ( data : CreateCheckoutDTO ) : Promise<any>
    handleSuccessfulPayment(session : Stripe.Checkout.Session) : Promise<IBaseResponse>
}