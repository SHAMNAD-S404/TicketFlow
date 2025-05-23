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
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: "employee",
      enum: ["employee", "departmentHead"],
    },
    liveTicket: {
      type: Number,
      default: 0,
    },
    authUserUUID: {
      type: String,
      required: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/ibsp4i0oEn5e1aN9jF8mQKmYaRTUiLZ46rj_CKntFB8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzg2LzQ3LzA5/LzM2MF9GXzI4NjQ3/MDk2NV92aWFITTZa/TmpyY3ZMRU5lMTR5/V1FGaTFqRW0yaktl/Vi5qcGc",
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.index({ companyId: 1, departmentId: 1 });
employeeSchema.index({ email: 1 }, { unique: true });

const EmployeeModel = mongoose.model<IEmployee & Document>("employees", employeeSchema);

export default EmployeeModel;
