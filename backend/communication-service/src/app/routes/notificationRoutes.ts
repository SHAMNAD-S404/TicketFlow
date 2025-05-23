import { Router } from "express";
import NotificationService from "../services/implements/notificationService";
import { INotificationService } from "../services/interface/INotificationService";
import { NotificationController } from "../controllers/implements/notificationController";
import { INotificationController } from "../controllers/interface/INotificationController";

/**
 * @file notification.routes.ts
 * @description Configures API routes for notification-related operations.
 * This file sets up the endpoints and links them to the appropriate controller methods.
 */



// Initialize notification service and controller instances
const notificaitonService : INotificationService = new NotificationService();
const notificaitonController : INotificationController = new NotificationController(notificaitonService);

// Create an Express router instance
const router = Router();

router.get ("/:userId",notificaitonController.getNotifications)
      .patch ("/:id/read" , notificaitonController.markAsRead)
      .patch ("/:userId/read-all", notificaitonController.markAllAsRead)
      .post ("/" , notificaitonController.createNotifiation)


export default router;