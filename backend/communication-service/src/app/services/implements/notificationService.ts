import { INotificationService, INotificationData } from "../interface/INotificationService";
import NotificationModel from "../../models/implements/NotificationSchema";
import { INotification } from "../../models/interface/INotification";
import { INotificationRepo } from "../../repositories/interface/INotificationRepo";
import NotificationRepo from "../../repositories/implements/notificationRepo";

const notificationRepo: INotificationRepo = new NotificationRepo();

export default class NotificationService implements INotificationService {
  async createNotification(data: INotificationData): Promise<INotification> {
    try {
      const { message, recipient, relatedId, tittle, type } = data;
      const notification = new NotificationModel({
        recipient,
        type,
        title: tittle,
        message,
        relatedId,
      });

      const savedNotification = await notificationRepo.create(notification);
      return savedNotification;
    } catch (error) {
      throw error;
    }
  }

  async getNotifications(userId: string, limit: number = 10): Promise<INotification[]> {
    try {
      return await notificationRepo.findNotifications({ recipient: userId }, limit);
    } catch (error) {
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await notificationRepo.getDocumentCount({ recipient: userId, read: false });
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    try {
      return await notificationRepo.updateOneDocument({ _id: notificationId }, { read: true });
    } catch (error) {
      throw error;
    }
  }
  

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await notificationRepo.updateAllDocument({ recipient: userId, read: false }, { read: true });
    } catch (error) {
      throw error;
    }
  }
}


