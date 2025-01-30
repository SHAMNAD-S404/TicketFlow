import { IEmployee } from "../../models/interface/IEmployeeModel";
import { IEmployeeAuthData } from "../../interfaces/IEmployeeAuthData";

export interface IEmployeeService {
    addEmployees(employeeData : IEmployee) : Promise<{message:string,success:boolean,authData?:IEmployeeAuthData}>
    fetchEmployeeData(email:string) : Promise<{message:string,success:boolean,data?:IEmployee}>
    updateEmployeeProfile(email:string , updateData:Partial<IEmployee>) : Promise<{message : string, success:boolean,data?:IEmployee}>
}