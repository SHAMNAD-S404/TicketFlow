import { INotificationService, INotificationData } from "../interface/INotificationService";
import NotificationModel from "../../models/implements/NotificationSchema";
import { INotification } from "../../models/interface/INotification";
import { INotificationRepo } from "../../repositories/interface/INotificationRepo";
import NotificationRepo from "../../repositories/implements/notificationRepo";

// creating a instance of notification class
const notificationRepo: INotificationRepo = new NotificationRepo();

/**
 * @class NotificationService
 * @description Implements the core business logic for handling notification-related operations.
 * This service acts as an intermediary, processing requests from controllers
 * and interacting with the notification repository for data persistence.
 * @implements {INotificationService}
 */
export default class NotificationService implements INotificationService {




//========================= CREATE NOTIFICATION =======================================================

  async createNotification(data: INotificationData): Promise<INotification> {

    const { message, recipient, relatedId, title, type } = data;
    // Creating new Notification model for storing data
    const notification = new NotificationModel({
      recipient,
      type,
      title,
      message,
      relatedId,
    });

    // Delegating to the repository layer for storing the data
    const savedNotification = await notificationRepo.create(notification);
    return savedNotification;
  }

//========================= GET NOIFICATION FROM REPOSITORY =============================================

  async getNotifications(userId: string, limit: number = 10): Promise<INotification[]> {
    return await notificationRepo.findNotifications({ recipient: userId, read: false }, limit);
  }

//========================= GET UNREAD COUNT OF NOTIFICATIONS =============================================

  async getUnreadCount(userId: string): Promise<number> {
    return await notificationRepo.getDocumentCount({ recipient: userId, read: false });
  }

//========================= MARK NOTIFICATION AS READ =====================================================

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await notificationRepo.updateOneDocument({ _id: notificationId }, { read: true });
  }

//========================= MARK ALL NOTIFICATION AS READ ==================================================

  async markAllAsRead(userId: string): Promise<void> {
    await notificationRepo.updateAllDocument({ recipient: userId, read: false }, { read: true });
  }
//========================= *********************************** =============================================

}
