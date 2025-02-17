import { IEmployeeRepo } from "../interface/IEmployeeRepo";
import { IEmployee } from "../../models/interface/IEmployeeModel";
import EmployeeModel from "../../models/implements/employee";
import { BaseRepository } from "./baseRepository";

class EmployeeRepository
  extends BaseRepository<IEmployee>
  implements IEmployeeRepo
{
  constructor() {
    super(EmployeeModel);
  }

  async createEmployee(employeeData: IEmployee): Promise<IEmployee | null> {
    try {
      return await this.create(employeeData);
    } catch (error) {
      throw new Error(`failed to create employee. error :, ${error}`);
    }
  }

  async checkEmployeeExistByEmail(email: string): Promise<IEmployee | null> {
    try {
      return await this.isUserExistByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeData(email: string): Promise<IEmployee | null> {
    try {
      const employeeData = await this.findOneWithEmail(email);
      return employeeData;
    } catch (error) {
      throw error;
    }
  }

  async getUpdatedEmployee(
    email: string,
    updateData: Partial<IEmployee>
  ): Promise<IEmployee | null> {
    try {
      const updatedEmployee = await this.updatByEmail(email, updateData);
      return updatedEmployee;
    } catch (error) {
      throw error;
    }
  }

  async findAllEmployees(companyId: string, page: number, sort: string, searchKey: string): Promise<{ employees: IEmployee[] | null; totalPages: number; }> {
      try {
        const limit = 1;
        const pageNumber = Math.max(1,page);
        const filter : Record<string, 1 | -1> = {
            [sort] : sort === "createdAt" ? -1 : 1,
        };

        const searchFilter  = 
            searchKey.trim() === "" ?
            {} : {
                $or : [
                    {name : {$regex : searchKey, $options : "i"}},
                    {email : {$regex : searchKey, $options : "i"}}
                ]
            };

            const fetchAllEmployees = await this.model
                .find({
                    $and:[
                        {companyId:companyId},
                        searchFilter,
                    ]
                })
                .sort(filter)
                .skip((pageNumber - 1) * limit)
                .limit(limit);
        
        const totalFilteredDocuments = await this.model.countDocuments({companyId,...searchFilter});
        const totalPages = Math.ceil(totalFilteredDocuments/limit);
        return {employees:fetchAllEmployees,totalPages}

      } catch (error) {
        console.log("error while fetching employee data",error);
        throw error;
      }
  }

  async updateEmployeeStatus(email: string, isBlock: boolean): Promise<IEmployee | null> {
      try {
            return await this.updateUserStatus(email,isBlock)
      } catch (error) {
        throw error;
      }
  }



}

export default new EmployeeRepository();
