import { BaseRepository } from "./baseRepository";
import { ITicket } from "../../models/interface/ITicketModel";
import { ITicketRepository } from "../interface/ITicketRepo";
import TicketModel from "../../models/implements/ticket";


class TicketRepository extends BaseRepository<ITicket> implements
    ITicketRepository {
        constructor(){
            super(TicketModel)
        }


        async createTicket(ticket: ITicket): Promise<ITicket> {
            try {
                return await this.create(ticket)
            } catch (error) {
                throw error
            }
        }

        async findOneDocument(query: Record<string, string>): Promise<ITicket | null> {
            try {
                return await this.findOneWithSingleField(query)
            } catch (error) {
                throw error
            }
        }

        async findAllTickets(authUserUUID: string, page: number, sortBy: string, searchQuery: string): Promise<{ tickets: ITicket[] | null; totalPages: number; }> {
            try {
                const limit = 4;
                const pageNumber = Math.max(1,page);
                const filter : Record<string , 1 | -1> = {
                    [sortBy] : sortBy === "createdAt" ? -1 : 1,
                }
                const searchFilter = searchQuery.trim() === "" ? {} : {
                    $or : [{ticketID:{$regex : searchQuery , $options:"i"}},
                        {ticketHandlingDepartmentName:{$regex: searchQuery , $options:"i"}},
                        {ticketRaisedDepartmentName : {$regex : searchQuery, $options:"i"}},
                        {ticketHandlingEmployeeName: {$regex : searchQuery, $options:"i"}}
                     ]
                };

                const fetchAllTickets = await this.model
                    .find({
                        $and:[{authUserUUID:authUserUUID},searchFilter],
                    })
                    .sort(filter)
                    .skip((page - 1) * limit)
                    .limit(limit);

                const totalFilteredDocuments = await this.model.countDocuments({ authUserUUID,...searchFilter });
                const totalPages = Math.ceil(totalFilteredDocuments/limit)
                return{tickets : fetchAllTickets , totalPages}

            } catch (error) {
                throw error
            }
        }



    }

    export default new TicketRepository();