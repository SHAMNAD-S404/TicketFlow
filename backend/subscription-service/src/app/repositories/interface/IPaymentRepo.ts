import { IPayment } from "../../models/interface/IPayment";


export interface IPaymentRepo {
    create ( payment : IPayment ) : Promise<IPayment>;
}