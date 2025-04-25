import {Document} from "mongoose";

export interface INotification extends Document {
    recipient : string;
    type : string;
    title : string;
    message : string;
    relatedId : string;
    read : boolean;
    createdAt : Date;
}