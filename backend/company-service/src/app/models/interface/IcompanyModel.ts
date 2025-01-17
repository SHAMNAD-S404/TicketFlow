import mongoose, { Document } from "mongoose";

// Interface for the company document
export interface ICompany extends Document {
  companyName: string;
  companyType: string;
  phoneNumber: string;
  corporatedId: string;
  email: string;
  originCountry: string;
  authUser: mongoose.Schema.Types.ObjectId;
}
