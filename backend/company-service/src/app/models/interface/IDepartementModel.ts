import mongoose,{Document} from "mongoose";

export interface IDepartment extends Document {
    companyId:mongoose.Types.ObjectId;
    departmentName:string;
    departmentNameNormalized:string;
    responsibilities:string;
    authUserUUID : string;
}