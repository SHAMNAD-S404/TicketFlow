import EmployeeProfile from "./profileMenu/mainMenu/EmployeeProfile";

interface MenuConfig {
    [key:string] : React.FC;
}



export const menuComponents : MenuConfig = {
    "Profile"     : EmployeeProfile,
} 