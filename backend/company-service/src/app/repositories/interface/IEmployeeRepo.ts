import { IEmployee } from "../../models/interface/IEmployeeModel";

export interface IEmployeeRepo {
    createEmployee(employeeData : IEmployee) : Promise<IEmployee | null >;
    getEmployeeData(email:string) : Promise<IEmployee | null>;
    getUpdatedEmployee(email:string,updateData:Partial<IEmployee>) : Promise<IEmployee | null>;
}