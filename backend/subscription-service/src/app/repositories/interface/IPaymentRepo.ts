import { IPaymentResponseDTO } from "../../dtos/paymentHistory.dto";
import { IPayment } from "../../models/interface/IPayment";

export interface IPaymentRepo {
  create(payment: IPayment): Promise<IPayment>;
  findOneDocument( filter : {stripeSessionId : string}) : Promise<IPayment | null>
  getAllPaymentsByAuthUUID  (authUserUUID : string) : Promise<IPaymentResponseDTO[] | null >
  getTotalOrdersCount  () : Promise<number>;
  getTotalRevanue () : Promise<number>
}
