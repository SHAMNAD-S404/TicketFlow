import { Request, Response } from "express";
import { ITicketShiftService } from "../../service/interface/ITicketShiftService";
import { IShiftRequestController } from "../interface/IShiftReqController";
import { searchInputSchema, ticketShiftReqValidation } from "../../dtos/basicValidation";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import TicketShiftReqModel from "../../models/implements/ticketShiftReq";
import Roles from "../../../constants/Roles";


/**
 * @class ShiftReqController
 * @description Handles incoming requests related to shift requests (or ticket shifts),
 * orchestrating the flow of data between the client and the shift request service layer.
 * @implements {IShiftRequestController}
 */
export class ShiftReqController implements IShiftRequestController {

   /**
   * @type {ITicketShiftService}
   * @description Instance of the shift request service, responsible for shift request-specific business logic.
   */
  private readonly shiftReqService: ITicketShiftService;

  /**
   * @constructor
   * @param {ITicketShiftService} ShiftReqService - The dependency for the shift request service.
   */


  constructor(ShiftReqService: ITicketShiftService) {
    this.shiftReqService = ShiftReqService;
  }



//========================= CREATE REQUEST ==========================================================

  public createRequest = async (req: Request, res: Response): Promise<void> => {
    try {

      //INPUT validation using zod schema
      const validateData = ticketShiftReqValidation.safeParse(req.body.data);
      if (!validateData.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }

      // creating new ticketShift req model for storing the document
      const shiftReqData = new TicketShiftReqModel({
        authUserUUID: req.query.authUserUUID,
        ...validateData.data,
      });

      // delegating to service layer for create document
      const createReq = await this.shiftReqService.createTicketShiftReqService(shiftReqData);
      const { message, statusCode, success } = createReq;
      res.status(statusCode).json({ message, success });

    } catch (error) {

      console.error("error while createTicketShiftReq", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET ALL REQUEST ==========================================================

  public getAllRequests = async (req: Request, res: Response): Promise<void> => {
    try {

      //INPUT validation using zod schema
      const validateData = searchInputSchema.safeParse(req.query);

      if (!validateData.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }

      // Authorization checking
      if (Roles.Company !== validateData.data.role) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.NO_ACCESS, success: false });
      }
      // fetching all ticket shift req documents using service layer
      const response = await this.shiftReqService.fetchAllRequestService(validateData.data);
      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while get all req", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };
//========================= REJECT REQUEST ===========================================================

  public rejectRequest = async (req: Request, res: Response): Promise<void> => {
    try {

      const { id, role } = req.query;
      // Authorization checking
      if (Roles.Company !== role) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      if (!id) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ALL_FILED_REQUIRED_ERR, success: false });
        return;
      }

      // reject request using service layer
      const result = await this.shiftReqService.rejectRequestService(id as string);
      const { message, statusCode, success } = result;
      res.status(statusCode).json({ message, success });

    } catch (error) {
      
      console.error("error while reject req", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= ************************************ =============================================
}
