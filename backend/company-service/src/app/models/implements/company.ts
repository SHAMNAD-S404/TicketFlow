import mongoose,{Document,Schema} from "mongoose";
import { ICompany } from "../interface/IcompanyModel";


const companySchema : Schema = new Schema<ICompany> ({
    companyName: { 
        type: String, required: true },
    companyType: { 
        type: String, required: true },
    phoneNumber: { 
        type: String, required: true },
    corporatedId: {
         type: String, required: true },
    role : {
         type: String,required : true , default:"comapny"}, 
    email: { 
         type: String, required: true },
    originCountry: {
         type: String, required: true },
    authUserUUID: {
         type: String, required: true },
     subscriptionPlan : {
          type:String , default : "Free tier"
     },
     isBlock : {
          type:Boolean , default : false
     },
     imageUrl : {
          type : String , default : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
     },

},
{timestamps: true});

const CompanyModel = mongoose.model<ICompany & Document>("company",companySchema);

export default CompanyModel;