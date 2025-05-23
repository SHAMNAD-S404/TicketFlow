import mongoose, { Schema } from "mongoose";
import { INotification } from "../interface/INotification";

// MONGO DB SCHEMA FOR NOTIFICATION COLLECTION
const NotificationSchema: Schema = new Schema<INotification>(
  {
    recipient: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: String,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, read: 1 });

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
export default NotificationModel;
