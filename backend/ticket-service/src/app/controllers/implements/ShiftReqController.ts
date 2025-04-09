import { Request, Response } from "express";
import { ITicketShiftService } from "../../service/interface/ITicketShiftService";
import { IShiftRequestController } from "../interface/IShiftReqController";
import { searchInputSchema, ticketShiftReqValidation } from "../../dtos/basicValidation";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import TicketShiftReqModel from "../../models/implements/ticketShiftReq";
import Roles from "../../../constants/Roles";


export class ShiftReqController implements IShiftRequestController {
  private readonly shiftReqService: ITicketShiftService;
  constructor(ShiftReqService: ITicketShiftService) {
    this.shiftReqService = ShiftReqService;
  }

  public createRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateData = ticketShiftReqValidation.safeParse(req.body.data);
      if (!validateData.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }
      const shiftReqData = new TicketShiftReqModel({
        authUserUUID: req.query.authUserUUID,
        ...validateData.data,
      });
      const createReq = await this.shiftReqService.createTicketShiftReqService(shiftReqData);
      const { message, statusCode, success } = createReq;
      res.status(statusCode).json({ message, success });
    } catch (error) {
      console.error("error while createTicketShiftReq", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };




  public getAllRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("hey im here")
      const validateData = searchInputSchema.safeParse(req.query);
      if (!validateData.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_FILED_OR_MISSING_FIELD, success: false });
        return;
      }
      if (Roles.Company !== validateData.data.role) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.NO_ACCESS, success: false });
      }

      const response = await this.shiftReqService.fetchAllRequestService(validateData.data);
      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });
    } catch (error) {
      console.error("error while get all req", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };


  public rejectRequest = async (req: Request, res: Response): Promise<void> => {
      try {
        const {id,role} = req.query;
        if(Roles.Company !== role){
            res.status(HttpStatus.BAD_REQUEST).json({message:Messages.NO_ACCESS,success:false})
            return;
        }
        if(!id){
            res.status(HttpStatus.BAD_REQUEST).json({message:Messages.ALL_FILED_REQUIRED_ERR,success:false});
            return
        }
        const result = await this.shiftReqService.rejectRequestService(id as string);
        const {message,statusCode,success}  = result;
        res.status(statusCode).json({message,success})
        
      } catch (error) {
        console.error("error while reject req", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
      }
  }

}
