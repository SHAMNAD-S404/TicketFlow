import { ITicketShiftReq } from "../../models/interface/ITicketShiftReq";
import { IBaseRepository } from "./IBaseRepo";

export interface ITicketShiftRepo extends IBaseRepository<ITicketShiftReq> {
  getAllRequests(
    page: number,
    sortBy: string,
    searchQuery: string,
    authUserUUID: string
  ): Promise<{ tickets: ITicketShiftReq[] | null; totalPages: number }>;
}
