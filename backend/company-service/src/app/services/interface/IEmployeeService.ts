import { IEmployee } from "../../models/interface/IEmployeeModel";
import { IEmployeeAuthData } from "../../interfaces/IEmployeeAuthData";

export interface IEmployeeService {
    addEmployees(employeeData : IEmployee) : Promise<{message:string,success:boolean,authData?:IEmployeeAuthData}>
}