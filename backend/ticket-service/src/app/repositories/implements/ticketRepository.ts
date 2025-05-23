import { BaseRepository } from "./baseRepository";
import { ITicket } from "../../models/interface/ITicketModel";
import {
  IFindAllTicketForEmployeeRaised,
  ITicketRepository,
  IupdateOnTicketClose,
  StatusCount,
} from "../interface/ITicketRepo";
import TicketModel from "../../models/implements/ticket";
import { ITicketReassignData } from "../../interface/userTokenData";

class TicketRepository extends BaseRepository<ITicket> implements ITicketRepository {
  constructor() {
    super(TicketModel);
  }

//========================= CREATE TICKET  ==========================================================

  async createTicket(ticket: ITicket): Promise<ITicket> {
    return await this.create(ticket);
  }

//========================= FIND ONE DOCUMENT =========================================================

  async findOneDocument(query: Record<string, string>): Promise<ITicket | null> {
    return await this.findOneWithSingleField(query);
  }

//========================= FIND ALL TICKET DOCS =======================================================

  async findAllTickets(
    authUserUUID: string,
    page: number,
    sortBy: string,
    searchQuery: string
  ): Promise<{ tickets: ITicket[] | null; totalPages: number }> {
    const limit = 5;
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
              { ticketRaisedDepartmentName: { $regex: searchQuery, $options: "i" } },
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

    const totalFilteredDocuments = await this.model.countDocuments({
      authUserUUID,
      ...searchFilter,
    });
    const totalPages = Math.ceil(totalFilteredDocuments / limit);
    return { tickets: fetchAllTickets, totalPages };
  }

//========================= TICKET RE ASSIGN HANLDE =============================================

  async ticketReassign(data: ITicketReassignData): Promise<ITicket | null> {
    return await this.model.findOneAndUpdate(
      { _id: data.ticketId },
      {
        $set: {
          ticketHandlingDepartmentId: data.selectedDepartmentId,
          ticketHandlingDepartmentName: data.selectedDepartmentName,
          ticketHandlingEmployeeId: data.selectedEmployeeId,
          ticketHandlingEmployeeName: data.selectedEmployeeName,
          ticketHandlingEmployeeEmail: data.selectedEmployeeEmail,
        },
      },
      { new: true }
    );
  }

//========================= FIND ONE DOC AND UPATE =============================================

  async findAndupdateStatus(
    id: string,
    status: string,
    ticketResolutions?: string
  ): Promise<ITicket | null> {
    const updateData: Record<string, string> = { status };
    if (ticketResolutions) {
      updateData.ticketResolutions = ticketResolutions;
    }
    return await this.findOneDocAndUpdate({ _id: id }, updateData);
  }

//========================= UPDATE ON TICKET CLOSE STATUS =============================================

  async updateOnTicketClose(updateData: IupdateOnTicketClose): Promise<ITicket | null> {
    const { id, ...updateField } = updateData;
    return await this.findOneDocAndUpdate({ _id: id }, updateField);
  }

//========================= FIND ALL TICKET FOR EMPLOYEES =============================================

  async findAllTicketForEmployee(
    authUserUUID: string,
    ticketHandlingEmployeeId: string,
    page: number,
    sortBy: string,
    searchQuery: string
  ): Promise<{ tickets: ITicket[] | null; totalPages: number }> {
    console.log(
      "auth : ",
      authUserUUID,
      "tickeHanEmID : ",
      ticketHandlingEmployeeId,
      "page :",
      page,
      "sort by",
      sortBy,
      "searchQuery",
      searchQuery
    );

    const limit = 4;
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
              { ticketRaisedDepartmentName: { $regex: searchQuery, $options: "i" } },
              { ticketHandlingEmployeeName: { $regex: searchQuery, $options: "i" } },
            ],
          };

    const fetchTickets = await this.model
      .find({
        $and: [
          { authUserUUID: authUserUUID, ticketHandlingEmployeeId: ticketHandlingEmployeeId },
          searchFilter,
        ],
      })
      .sort(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalFilteredDocuments = await this.model.countDocuments({
      ticketHandlingEmployeeId,
      authUserUUID,
      ...searchFilter,
    });
    const totalPages = Math.ceil(totalFilteredDocuments / limit);
    console.log("test 2 tickes : ", fetchTickets);
    return { tickets: fetchTickets, totalPages };
  }

//========================= FIND ALL TICKET EMPLOYEE RAISED WISE =================================

  async findAllTicketsForEmployeeRaised(
    data: IFindAllTicketForEmployeeRaised
  ): Promise<{ tickets: ITicket[] | null; totalPages: number }> {
    const { authUserUUID, page, searchQuery, sortBy, ticketRaisedEmployeeId } = data;
    const limit = 5;
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
              { ticketRaisedDepartmentName: { $regex: searchQuery, $options: "i" } },
              { ticketHandlingEmployeeName: { $regex: searchQuery, $options: "i" } },
            ],
          };

    const fetchTickets = await this.model
      .find({
        $and: [
          { authUserUUID: authUserUUID, ticketRaisedEmployeeId: ticketRaisedEmployeeId },
          searchFilter,
        ],
      })
      .sort(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalFilteredDocuments = await this.model.countDocuments({
      ticketRaisedEmployeeId,
      authUserUUID,
      ...searchFilter,
    });
    const totalPages = Math.ceil(totalFilteredDocuments / limit);
    return { tickets: fetchTickets, totalPages };
  }

//========================= EDIT TICKET DOC =========================================================

  async editTicketRepo(id: string, udpateData: Record<string, string>): Promise<ITicket | null> {
    return await this.findOneDocAndUpdate({ _id: id }, udpateData);
  }

//========================= GET AVERAGE RESOLUTION TIME OF TICKET RESOLVED ============================

  async getAverageResolutionTime(fieldName: string, fieldValue: string): Promise<string> {
    const filter = { [fieldName]: fieldValue };

    const result = await this.model.aggregate([
      // match resolved tickets for specific user
      {
        $match: {
          ...filter,
          status: "resolved",
        },
      },
      // Calculte the resolution itme for each ticket in hour
      {
        $project: {
          resolutionTimeInHours: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] }, //to find diff in mill seconds
              1000 * 60 * 60, //conver to hours
            ],
          },
        },
      },
      //group and calculate
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          averageResolutionTimeInHours: { $avg: "$resolutionTimeInHours" },
        },
      },
    ]);

    if (!result.length) {
      return "0 hours";
    }
    //Roud the value
    const averageHours = Math.max(0, Math.round(result[0].averageResolutionTimeInHours * 10) / 10);
    return `${averageHours} hours`;
  }

//========================= DYNAMIC TICKET STATUS COUNTS =============================================

  async getDynamicTicketStatusCounts(
    fieldName: string,
    fieldValue: string,
    statuses: string[]
  ): Promise<StatusCount> {
    const filter = { [fieldName]: fieldValue };
    const result = await this.model.aggregate([
      //match documents
      {
        $match: {
          ...filter,
          status: { $in: statuses },
        },
      },
      //group based on status
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    //convert to obj with default value of 0
    const counts: StatusCount = {};
    statuses.forEach((status) => {
      counts[status] = 0;
    });
    //update with actual counts
    result.forEach((item) => {
      counts[item._id] = item.count;
    });
    return counts;
  }
//========================= DEPARTMENT TICKET COUNTS =============================================

  async getDepartmentTicketCounts(filedName: string, fieldValue: string): Promise<StatusCount> {
    const filter = { [filedName]: fieldValue };
    const result = await this.model.aggregate([
      //math documents
      {
        $match: {
          ...filter,
          ticketHandlingDepartmentName: { $exists: true, $ne: null },
        },
      },
      //group by department
      {
        $group: {
          _id: "$ticketHandlingDepartmentName",
          count: { $sum: 1 },
        },
      },
      //sort to by count
      {
        $sort: {
          count: -1,
        },
      },
      //limit
      {
        $limit: 5,
      },
    ]);

    // Handle empty results
    if (!result || result.length === 0) {
      return {} as StatusCount;
    }

    // Process results with proper type checking
    const departmentCounts = result.reduce<StatusCount>((acc, curr) => {
      if (curr._id && typeof curr._id === "string" && typeof curr.count === "number") {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    return departmentCounts;
  }

  //========================= GET UN RESOLVED TICKET BY PRIORITY =============================================

  async getUnResolvedTicketsByPriority(
    fieldName: string,
    fieldValue: string
  ): Promise<StatusCount> {
    const filter = { [fieldName]: fieldValue };

    const result = await this.model.aggregate([
      //math document
      {
        $match: {
          ...filter,
          status: { $ne: "resolved" },
          priority: { $exists: true, $ne: null },
        },
      },
      //group document by prioriy
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      //sort
      {
        $sort: {
          count: -1,
        },
      },
    ]);
    const priorityTicketCounts: StatusCount = {};

    //add zero as default value
    const defaultPriorities = ["medium priority", "high priority", "low priority"];
    defaultPriorities.forEach((priority) => {
      priorityTicketCounts[priority] = 0;
    });

    // update with actual values
    result.forEach(({ _id, count }) => {
      if (_id) {
        const priority = _id.toLowerCase();
        priorityTicketCounts[priority] = count;
      }
    });

    //retun result
    return priorityTicketCounts;
  }

//========================= GET TOP GROUP COUNT =============================================

  async getTopGroupCount(
    mathchField: string,
    matchValue: string,
    groupField: string
  ): Promise<{ name: string; count: number }> {
    const filter = { [mathchField]: matchValue };

    const result = await this.model.aggregate([
      {
        $match: {
          ...filter,
          [groupField]: { $exists: true, $ne: null },
        },
      },
      //group by specific field
      {
        $group: {
          _id: `$${groupField}`,
          count: { $sum: 1 },
        },
      },
      //sort by count
      {
        $sort: {
          count: -1,
        },
      },
      //get top result
      {
        $limit: 1,
      },
    ]);

    //return default for no results
    if (!result.length) {
      return {
        name: "Didn't Selected",
        count: 0,
      };
    }

    return {
      name: result[0]._id,
      count: result[0].count,
    };
  }
//========================= ************************************* =====================================
}

export default new TicketRepository();
