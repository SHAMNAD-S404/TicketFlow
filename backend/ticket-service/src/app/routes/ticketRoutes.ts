import { Router , Request,Response } from "express";
import multer from "multer";
import { storage } from "../../storage/storage";
import { fileFilter } from "../middlewares/multerValidation";
import { extractUserData } from "../middlewares/extractUserData";
import { TicketController } from "../controllers/implements/ticketController";
import TicketService from "../service/implements/ticketService";
import { ITicketController } from "../controllers/interface/ITicketController";
import { ITicketService } from "../service/interface/ITicketService";
import { ITicketShiftService } from "../service/interface/ITicketShiftService";
import TicketShiftService from "../service/implements/ticketShiftService";
import { IShiftRequestController } from "../controllers/interface/IShiftReqController";
import { ShiftReqController } from "../controllers/implements/ShiftReqController";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";

//creating new instance of each classes with dp injection
const ticketService : ITicketService = new TicketService();
const ticketController : ITicketController = new TicketController(ticketService);
const shiftReqService : ITicketShiftService = new TicketShiftService();
const shiftReqController : IShiftRequestController = new ShiftReqController(shiftReqService);

//multer setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});


const router = Router();


//Route handling 
router.post  ("/create-ticket", extractUserData, upload.single("file"), ticketController.createTicket)
      .get   ("/get-all-tickets",extractUserData,ticketController.getAllTickets)
      .get   ("/get-ticket-employee-wise",extractUserData,ticketController.getTicketEmployeeWise)
      .get   ("/get-myticket-progress",extractUserData,ticketController.getTicketEmployeeRaisedWise)
      .get   ("/get-ticket",ticketController.fetchTicket)
      .get   ("/get-all-shift-req",extractUserData,shiftReqController.getAllRequests)
      .get   ("/fetch-all-ticket-statics",extractUserData,ticketController.fetchAllTicketStatics)
      .get   ("/fetch-my-ticket-statics",extractUserData,ticketController.fetchMyTicketStatics)
      .get   ("/fetch-assigned-ticket-statics",extractUserData,ticketController.fetchAssignedTicketStatics)
      .get   ("/fetch-all-ticket-stats-dashboard",extractUserData,ticketController.getTicketStatsForDashboard)
      .get   ("/fetch-all-ticket-employee-dashboard",extractUserData,ticketController.getTicketStatsForEmployee)
      .get   ("/fetch-dashboard-data",extractUserData,ticketController.getDashboardData)
      .get   ("/fetch-employee-dashbaord-data",extractUserData,ticketController.getEmployeeDashboardData)
      .patch ("/ticket-reassign",extractUserData,ticketController.ticketReassign)
      .patch ("/update-status",ticketController.updateTicketStatus)
      .patch ("/edit-ticket",upload.single("file"),ticketController.editTicket)
      .patch ("/re-open-ticket",ticketController.ticketReOpen)
      .post  ("/ticket-shift-request",extractUserData,shiftReqController.createRequest)
      .delete("/reject-shift-req",extractUserData,shiftReqController.rejectRequest)


// Catch all for unknown routes
router.use("*",(req : Request, res : Response) => {
  res.status(HttpStatus.NOT_FOUND).json({
    message : Messages.ROUTE_WILD_CARD_MESSAGE,
    success : false,
  });
});


export default router;
