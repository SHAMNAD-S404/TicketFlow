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



    }

    export default new TicketRepository();