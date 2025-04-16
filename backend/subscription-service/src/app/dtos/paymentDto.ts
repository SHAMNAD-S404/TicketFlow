export interface CreateCheckoutDTO {

  authUserUUID: string;
  companyName: string;
  companyEmail: string;
  amount: string;
  plan: string;
  planValidity: string;
  planStartDate: string;
  planEndDate: string;
  successUrl : string;
  cancelUrl : string;

}
