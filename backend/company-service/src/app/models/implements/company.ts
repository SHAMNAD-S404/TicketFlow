import mongoose,{Document,Schema} from "mongoose";
import { ICompany } from "../interface/IcompanyModel";

const companySchema : Schema = new Schema<ICompany> ({
    companyName: { type: String, required: true },
    companyType: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    corporatedId: { type: String, required: true },
    email: { type: String, required: true },
    originCountry: { type: String, required: true },
    authUser: { type: mongoose.Schema.Types.ObjectId, required: true }

},
{timestamps: true});

const CompanyModel = mongoose.model<ICompany & Document>("company",companySchema);

export default CompanyModel;