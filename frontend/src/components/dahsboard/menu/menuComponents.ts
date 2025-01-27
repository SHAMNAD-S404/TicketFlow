import EmployeeManagement from "./employeeMenu/mainMenu/EmployeeManagement";
import DepartmentManagement from "./departmentMenu/mainMenu/DepartmentManagement";

interface MenuConfig {
    [key:string] : React.FC;
}



export const menuComponents : MenuConfig = {
    "Employee Management" : EmployeeManagement,
    "Department Management" : DepartmentManagement,
} 