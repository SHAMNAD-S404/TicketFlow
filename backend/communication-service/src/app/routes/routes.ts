import {Router} from "express";
import ChatService from "../services/implements/chatService";
import { ChatController } from "../controllers/implements/chatController";

const router = Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService);


router.get ("/get-message",chatController.getMessagesByTicketID)
      .get ("/get-all-rooms",chatController.getAllChatRooms)

export default router;