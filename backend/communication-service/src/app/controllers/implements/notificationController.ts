import { Request, Response } from "express";
import { INotificationService } from "../../services/interface/INotificationService";
import { INotificationController } from "../interface/INotificationController";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";
import { sendUserNotification } from "../../../socket";

/**
 * @class NotificationController
 * @description Handles incoming requests related to notifications and orchestrates
 * the flow of data between the client and the notification service layer.
 * @implements {INotificationController}
 */
export class NotificationController implements INotificationController {
    /**
     * @type {INotificationService}
     * @description An instance of the notification service responsible for business logic.
     */
    private readonly notificatoinService: INotificationService;

    /**
     * @constructor
     * @param {INotificationService} NotificationService - The dependency for the notification service.
     */
  constructor(NotificationService: INotificationService) {
    this.notificatoinService = NotificationService;
  }


  //========================= GET NOTIFICATION BY USER ID =============================================

  public getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {

      const userId = req.params.userId;
      // Document limit
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      // delegating to the service layer for getting asychronously notification and unread count
      const [notificaiton, unreadCount] = await Promise.all([
        this.notificatoinService.getNotifications(userId, limit),
        this.notificatoinService.getUnreadCount(userId),
      ]);
    
      res.status(HttpStatus.OK).json({
        message: Messages.DATA_FETCHED,
        success: true,
        data: { notificaiton, unreadCount },
      });
    } catch (error) {
      console.log(Messages.ERROR_WHILE, "getNotification", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  //========================= MARK NOTIFICATION A AS - READ  =============================================

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {

      const notificaitonId = req.params.id;
      // Delegating to the service layer for mark notification as read
      const updatedNotification = await this.notificatoinService.markAsRead(notificaitonId);
     
      // if update notification failed
      if (!updatedNotification) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.DATA_NOT_FOUND, success: false });
        return;
      }

      // if update notification success
      res
        .status(HttpStatus.OK)
        .json({ message: Messages.NOTIFICATION_UPDATED, success: true, data: updatedNotification });
    } catch (error) {

      console.log(Messages.ERROR_WHILE, "mark as Read", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  //========================= MARK ALL NOTIIFICATION AS READ =============================================

  public markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      // Delegating to the service layer for mark all notification as read
      await this.notificatoinService.markAllAsRead(userId);

      res.status(HttpStatus.OK).json({ message: Messages.NOTIFICATION_UPDATED, success: true });
    } catch (error) {

      console.log(Messages.ERROR_WHILE, "mark all read", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  //========================= CREATE A NOTIFICATION =====================================================

  public createNotifiation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recipient, type, title, message, relatedId } = req.body;

      // Delegating to the service layer for create and send notificattion
      const notificaiton = await sendUserNotification(recipient, {
        type,
        title,
        message,
        relatedId,
      });

      res
        .status(HttpStatus.OK)
        .json({ message: Messages.NOTIFICATION_CREATED, success: true, data: notificaiton });

    } catch (error) {

      console.log(Messages.ERROR_WHILE, "create notificattion", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  //========================= ********************************* =============================================
}
