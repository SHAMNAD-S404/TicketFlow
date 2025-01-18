import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/IUser";

export type UserDocument = IUser & Document;

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role :{type: String , required: true},
},
{timestamps: true});

export default mongoose.model<UserDocument>("User", UserSchema);
