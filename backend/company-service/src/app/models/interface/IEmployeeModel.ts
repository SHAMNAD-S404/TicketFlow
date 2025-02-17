import mongoose,{Document} from "mongoose";

export interface IEmployee extends Document {
    companyId : mongoose.Types.ObjectId;
    name : string;
    email : string;
    departmentId : mongoose.Types.ObjectId;
    departmentName : string;
    role? : string;
    phone : string;
    authUserUUID : string;
    isBlock : boolean;

}