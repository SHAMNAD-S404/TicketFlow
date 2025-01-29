import { IEmployee } from "../../models/interface/IEmployeeModel";

export interface IEmployeeRepo {
    createEmployee(employeeData : IEmployee) : Promise<IEmployee | null >;
}