export interface IHandlePurchaseData {
  authUserUUID: string;
  companyEmail: string;
  companyName: string;
  amount: string;
  plan: string;
  planValidity: string;
  planStartDate: string;
  planEndDate: string;
  successUrl: string;
  cancelUrl: string;
}
