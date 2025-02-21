import { ITicket } from "../../models/interface/ITicketModel";
import TicketRepository from "../../repositories/implements/ticketRepository";
import { ITicketService } from "../interface/ITicketService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";


export default class TicketService implements ITicketService {

    async createTicketDocument(ticketData: ITicket): Promise<{ message: string; success: boolean; statusCode: number; data?: ITicket; }> {
        try {

            

            //create ticket
            const newTicket = await TicketRepository.createTicket(ticketData)
            if(!newTicket){
                return {message: Messages.DATA_NOT_FOUND , success : false,
                    statusCode:HttpStatus.BAD_REQUEST
                }
            }else{
                return {
                    message : Messages.DATA_CREATED,
                    success : true,
                    statusCode: HttpStatus.OK,
                    data : newTicket
                }
            }

        } catch (error) {
            throw error
        }
    }
}