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

    async getEmployeeData(email: string): Promise<IEmployee | null> {
        try {
            const employeeData = await this.findOneWithEmail(email)
            return employeeData;
        } catch (error) {
            throw error;
        }
    }

    async getUpdatedEmployee(email: string, updateData: Partial<IEmployee>): Promise<IEmployee | null> {
        try {
            const updatedEmployee = await this.updatByEmail(email,updateData )
            return updatedEmployee;
        } catch (error) {
            throw error;
        }
    }
}

export default new EmployeeRepository();