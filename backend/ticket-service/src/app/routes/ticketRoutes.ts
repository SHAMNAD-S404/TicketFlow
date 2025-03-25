import { Router } from "express";
import multer from "multer";
import { storage } from "../../storage/storage";
import { fileFilter } from "../middlewares/multerValidation";
import { extractUserData } from "../middlewares/extractUserData";
import { TicketController } from "../controllers/implements/ticketController";
import TicketService from "../service/implements/ticketService";

const ticketService = new TicketService();
const ticketController = new TicketController(ticketService);

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

const router = Router();

router.post  ("/create-ticket", extractUserData, upload.single("file"), ticketController.createTicket)
      .get   ("/get-all-tickets",extractUserData,ticketController.getAllTickets)
      .get   ("/get-ticket-employee-wise",extractUserData,ticketController.getTicketEmployeeWise)
      .get   ("/get-myticket-progress",extractUserData,ticketController.getTicketEmployeeRaisedWise)
      .get   ("/get-ticket",ticketController.fetchTicket)
      .patch ("/ticket-reassign",extractUserData,ticketController.ticketReassign)
      .patch ("/update-status",ticketController.updateTicketStatus)
      .patch ("/edit-ticket",upload.single("file"),ticketController.editTicket)
      .patch ("/re-open-ticket",ticketController.ticketReOpen)

export default router;
