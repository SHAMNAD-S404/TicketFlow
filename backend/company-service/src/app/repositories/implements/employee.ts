import { IEmployeeRepo } from "../interface/IEmployeeRepo";
import { IEmployee } from "../../models/interface/IEmployeeModel";
import EmployeeModel from "../../models/implements/employee";
import { BaseRepository } from "./baseRepository";

class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepo {

    constructor(){
        super(EmployeeModel)
    }

    async createEmployee(employeeData: IEmployee): Promise<IEmployee | null> {
        try {
            return await this.create(employeeData);
            
        } catch (error) {
            throw new Error (`failed to create employee. error :, ${error}`)
        }
    }

    async checkEmployeeExistByEmail(email:string) : Promise<IEmployee | null> {
        try {

            return await this.isUserExistByEmail(email);

        } catch (error) {
            throw error;
        }
    }
}

export default new EmployeeRepository();