import { INotification } from "../../models/interface/INotification";

export interface INotificationData {
    recipient : string;
    type : string;
    tittle : string;
    message : string;
    relatedId : string;
}

export interface INotificationService {
    createNotification(data : INotificationData) : Promise<INotification>;
    getNotifications(userId : string, limit?: number) : Promise<INotification[]>;
    getUnreadCount(userId : string) : Promise<number>;
    markAsRead(notificationId : string) : Promise<INotification | null>
    markAllAsRead(userId : string) : Promise<void>;
}