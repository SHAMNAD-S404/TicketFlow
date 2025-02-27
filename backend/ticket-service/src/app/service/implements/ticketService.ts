import { ITicket } from "../../models/interface/ITicketModel";
import TicketRepository from "../../repositories/implements/ticketRepository";
import { ITicketService } from "../interface/ITicketService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { boolean } from "zod";


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

    async fetchAllTickets(authUserUUID: string, page: number, sortBy: string, searchQuery: string): Promise<{ message: string; statusCode: number; success: boolean; data?: { tickets: ITicket[] | null; totalPages: number; }; }> {
        try {
            const result = await TicketRepository.findAllTickets(authUserUUID,page,sortBy,searchQuery);
            if(result){
                return{
                    message : Messages.FETCH_SUCCESS,
                    statusCode:HttpStatus.OK,
                    success: true,
                    data: result,
                }
            }else{
                return{
                    message:Messages.DATA_NOT_FOUND,
                    statusCode:HttpStatus.BAD_REQUEST,
                    success:false
                }
            }
        } catch (error) {
            throw error
        }
    }
}