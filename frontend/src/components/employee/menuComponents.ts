import EmployeeProfile from "./profileMenu/mainMenu/EmployeeProfile";
import { TicketHome } from "./Ticket/TicketHome";

interface MenuConfig {
    [key:string] : React.FC;
}



export const menuComponents : MenuConfig = {
    "Profile"     : EmployeeProfile,
    "Tickets"     : TicketHome,
} 