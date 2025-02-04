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
         type: String, required: true }

},
{timestamps: true});

const CompanyModel = mongoose.model<ICompany & Document>("company",companySchema);

export default CompanyModel;