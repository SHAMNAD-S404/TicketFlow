import EmployeeManagement from "./employeeMenu/mainMenu/EmployeeManagement";
import DepartmentManagement from "./departmentMenu/mainMenu/DepartmentManagement";
import ProfileUI from "./profileMenu/mainMenu/ProfileUI";
import { TicketHome } from "./Ticket/TicketHome";

interface MenuConfig {
    [key:string] : React.FC;
}



export const menuComponents : MenuConfig = {
    "Employee Management" : EmployeeManagement,
    "Department Management" : DepartmentManagement,
    "Profile"               : ProfileUI,
    "Tickets"               : TicketHome,
} 