import mongoose, { Document, Schema } from "mongoose";
import { IDepartment } from "../interface/IDepartementModel";

const departmentSchema: Schema = new Schema<IDepartment>(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    departmentName: { type: String, required: true },
    departmentNameNormalized: { type: String, required: true },
    responsibilities: { type: String, required: true },
    authUserUUID: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//adding a compound index for companyId and departementName fields
departmentSchema.index({ companyId: 1, departmentNameNormalized: 1 }, { unique: true });

const DepartmentModel = mongoose.model<IDepartment & Document>("departments", departmentSchema);
export default DepartmentModel;
