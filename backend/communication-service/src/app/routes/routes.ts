import {Router} from "express";
import ChatService from "../services/implements/chatService";
import { ChatController } from "../controllers/implements/chatController";


/**
 * @file routes.ts
 * @description Configures API routes for CHAT-related operations.
 * This file sets up the endpoints and links them to the appropriate controller methods.
 */


// Create an Express router instance
const router = Router();

// Initialize notification service and controller instances
const chatService = new ChatService();
const chatController = new ChatController(chatService);


router.get ("/get-message",chatController.getMessagesByTicketID)
      .get ("/get-all-rooms",chatController.getAllChatRooms)

export default router;