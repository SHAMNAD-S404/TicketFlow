import { IEmployee } from "../interface/IEmployeeModel";
import mongoose, { Document, Schema } from "mongoose";

const employeeSchema: Schema = new Schema<IEmployee>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "company",
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "departments",
    },
    name: {
       type: String, required: true, trim: true
    },
    email: { 
      type: String, required: true, lowercase: true 
    },
    phone: { 
      type: String, required: true 
    },
    departmentName: { 
      type: String, required: true, trim: true 
    },
    role: {
      type: String,
      required: true,
      default: "employee",
      enum: ["employee", "departmentHead"],
    },
    authUserUUID: { 
      type: String, required: true 
    },
    isBlock : {
      type:Boolean , default : false
    }
  },
  {
    timestamps: true,
  }
);

employeeSchema.index({ companyId: 1, departmentId: 1 });
employeeSchema.index({ email: 1 }, { unique: true });

const EmployeeModel = mongoose.model<IEmployee & Document>(
  "employees",
  employeeSchema
);

export default EmployeeModel;
