 export interface CheckoutItem {
    id : string,
    name : string,
    description ?: string;
    price : string ;
    quantity : number;
 }

 export interface CheckoutSessionRequest {
    items : CheckoutItem[];
    customerId ? : string ;
    metadata ? : Record<string,string>;
    successUrl ? : string;
    cancelUrl ? : string ;

 }

 export interface checkoutSession {
    sessionId : string;
    customerId? : string;
    amount : number;
    status : string;
    metadata : Record <string,string>;
    createdAt : Date;
 }

 export interface PaymentStatusUpdate {
    sessionId : string;
    status : string ;
    updateAt : Date ;
 }


 export interface PaymentSessionStatus {
    status: string;
    customerEmail?: string;
    amountTotal?: number;
    currency?: string;
  }