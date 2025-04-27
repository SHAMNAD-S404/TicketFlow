import { Router } from "express";
import NotificationService from "../services/implements/notificationService";
import { INotificationService } from "../services/interface/INotificationService";
import { NotificationController } from "../controllers/implements/notificationController";
import { INotificationController } from "../controllers/interface/INotificationController";


const notificaitonService : INotificationService = new NotificationService();
const notificaitonController : INotificationController = new NotificationController(notificaitonService);

const router = Router();

router.get ("/:userId",notificaitonController.getNotifications)
      .patch ("/:id/read" , notificaitonController.markAsRead)
      .patch ("/:userId/read-all", notificaitonController.markAllAsRead)
      .post ("/" , notificaitonController.createNotifiation)


export default router;