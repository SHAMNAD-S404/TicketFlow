import  { Document } from "mongoose";

// Interface for the company document
export interface ICompany extends Document {
  companyName: string;
  companyType: string;
  phoneNumber: string;
  corporatedId: string;
  email: string;
  originCountry: string;
  authUserUUID : string;
  role : string ;
  subscriptionPlan:string;
  subscriptionEndDate : string;
  isBlock : boolean;
  imageUrl : string;
}
