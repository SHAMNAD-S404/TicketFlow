import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { IBasicResponse } from "../../interface/userTokenData";
import { ITicketShiftReq } from "../../models/interface/ITicketShiftReq";
import ticketShiftReqRepo from "../../repositories/implements/ticketShiftReqRepo";
import {
  IfetchAllRequestServiceParams,
  IfetchAllRequestServiceResult,
  ITicketShiftService,
} from "../interface/ITicketShiftService";


/**
 * @class TicketShiftService
 * @description Implements the core business logic for managing ticket shift (or shift request) related operations.
 * This service processes requests from controllers and interacts with data access layers
 * (e.g., repositories) for ticket shift data persistence and retrieval.
 * @implements {ITicketShiftService}
 */

export default class TicketShiftService implements ITicketShiftService {


//========================= CREATE TICKET SHIFT REQUEST =============================================

  async createTicketShiftReqService(data: ITicketShiftReq): Promise<IBasicResponse> {
    const isExist = await ticketShiftReqRepo.findOneWithSingleField({ ticketID: data.ticketID });
    if (isExist) {
      return {
        message: Messages.REQ_EXIST,
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
      };
    }
    const saveDocument = await ticketShiftReqRepo.create(data);
    if (saveDocument) {
      return {
        message: Messages.REQ_SUBMITED,
        statusCode: HttpStatus.OK,
        success: true,
      };
    } else {
      return {
        message: Messages.SOMETHING_WRONG,
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
      };
    }
  }

//========================= FETCH ALL REQ SERVICE =====================================================

  async fetchAllRequestService(
    params: IfetchAllRequestServiceParams
  ): Promise<IfetchAllRequestServiceResult> {
    const { authUserUUID, page, searchQuery, sortBy } = params;
    const result = await ticketShiftReqRepo.getAllRequests(page, sortBy, searchQuery, authUserUUID);
    if (result) {
      return {
        message: Messages.FETCH_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        data: result,
      };
    } else {
      return {
        message: Messages.DATA_NOT_FOUND,
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
      };
    }
  }

//========================= REJECT REQUEST SERVICE =======================================================

  async rejectRequestService(id: string): Promise<IBasicResponse> {
    const result = await ticketShiftReqRepo.deleteOneDocument({ _id: id });
    if (result) {
      return {
        message: Messages.REQ_REJECTED,
        success: true,
        statusCode: HttpStatus.OK,
      };
    } else {
      return {
        message: Messages.SOMETHING_WRONG,
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
      };
    }
  }
//========================= ********************************* =================================================
}
