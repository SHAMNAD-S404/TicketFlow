import { ITicketShiftReq } from "../../models/interface/ITicketShiftReq";
import { IBasicResponse } from "../../interface/userTokenData";

export interface IfetchAllRequestServiceParams {
  authUserUUID: string;
  page: number;
  sortBy: string;
  searchQuery: string;
}

export interface IfetchAllRequestServiceResult extends IBasicResponse {
  data?: { tickets: ITicketShiftReq[] | null; totalPages: number };
}

//========================= INTERFACE FOR TICKET SHIFT SERVICE =============================================

export interface ITicketShiftService {
  createTicketShiftReqService(data: ITicketShiftReq): Promise<IBasicResponse>;
  fetchAllRequestService(params: IfetchAllRequestServiceParams): Promise<IfetchAllRequestServiceResult>;
  rejectRequestService (id:string) : Promise<IBasicResponse>
  
}
