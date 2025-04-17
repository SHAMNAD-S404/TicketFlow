
export interface OrderDetails {
    _id: string;
    authUserUUID: string;
    companyName:string;
    companyEmail: string;
    amount: string;
    purchaseDate:string;
    plan: string;
    planValidity: string;
    planStartDate: string;
    planEndDate: string;
    paymentStatus: string;
    stripeSessionId:string;
    stripePaymentIntentId:string;
    createdAt: Date;
    updatedAt: Date;
}
