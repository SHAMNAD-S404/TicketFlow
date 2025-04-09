import { BaseRepository } from "./baseRepository";
import { ITicketShiftReq } from "../../models/interface/ITicketShiftReq";
import { ITicketShiftRepo } from "../interface/ITicketShiftRepo";
import TicketShiftReqModel from "../../models/implements/ticketShiftReq";

class TicketShiftReqRepository extends BaseRepository<ITicketShiftReq> implements ITicketShiftRepo {
  constructor() {
    super(TicketShiftReqModel);
  }

  async getAllRequests(
    page: number,
    sortBy: string,
    searchQuery: string,
    authUserUUID: string
  ): Promise<{ tickets: ITicketShiftReq[] | null; totalPages: number }> {
    try {
      const limit = 8;
      const filter: Record<string, 1 | -1> = {
        [sortBy]: sortBy === "createdAt" ? -1 : 1,
      };
      const searchFilter =
        searchQuery.trim() === ""
          ? {}
          : {
              $or: [
                { ticketID: { $regex: searchQuery, $options: "i" } },
                { ticketHandlingDepartmentName: { $regex: searchQuery, $options: "i" } },
                { ticketHandlingEmployeeName: { $regex: searchQuery, $options: "i" } },
              ],
            };

      const fetchAllTickets = await this.model
        .find({
          $and: [{ authUserUUID: authUserUUID }, searchFilter],
        })
        .sort(filter)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalFilteredDocuments = await this.model.countDocuments({ authUserUUID, ...searchFilter });
      const totalPages = Math.ceil(totalFilteredDocuments / limit);
      return { tickets: fetchAllTickets, totalPages };
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketShiftReqRepository();
