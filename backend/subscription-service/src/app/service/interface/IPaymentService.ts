import Stripe from "stripe";
import { CreateCheckoutDTO } from "../../dtos/paymentDto";
import { IPayment } from "../../models/interface/IPayment";
import { IPaymentResponseDTO } from "../../dtos/paymentHistory.dto";

export interface IBaseResponse {
  message: string;
  success: boolean;
  statusCode: number;
}

export interface orderDetailsResponse extends IBaseResponse {
  data?: IPayment;
}

export interface IPaymentHistoryRes extends IBaseResponse {
  data?: IPaymentResponseDTO[] | null;
}
export interface IRevanuAndCountResp extends IBaseResponse {
  data?: {
    totalRevenue: number;
    totalOrders: number;
  };
}

export interface IPaymentService {
  createCheckoutSession(data: CreateCheckoutDTO): Promise<any>;
  handleSuccessfulPayment(session: Stripe.Checkout.Session): Promise<IBaseResponse>;
  getOrderDetailsService(sessionId: string): Promise<orderDetailsResponse>;
  getAllPaymentHistoryService(authUserUUID: string): Promise<IPaymentHistoryRes>;
  getRevanueAndCount(): Promise<IRevanuAndCountResp>;
}
