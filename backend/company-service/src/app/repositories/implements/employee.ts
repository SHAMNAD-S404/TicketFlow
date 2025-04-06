import { IEmployeeRepo } from "../interface/IEmployeeRepo";
import { IEmployee } from "../../models/interface/IEmployeeModel";
import EmployeeModel from "../../models/implements/employee";
import { BaseRepository } from "./baseRepository";

class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepo {
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

  async getUpdatedEmployee(email: string, updateData: Partial<IEmployee>): Promise<IEmployee | null> {
    try {
      const updatedEmployee = await this.updatByEmail(email, updateData);
      return updatedEmployee;
    } catch (error) {
      throw error;
    }
  }

  async findAllEmployees(
    companyId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ employees: IEmployee[] | null; totalPages: number }> {
    try {
      const limit = 6;
      const pageNumber = Math.max(1, page);
      const filter: Record<string, 1 | -1> = {
        [sort]: sort === "createdAt" ? -1 : 1,
      };

      const searchFilter =
        searchKey.trim() === ""
          ? {}
          : {
              $or: [{ name: { $regex: searchKey, $options: "i" } }, { email: { $regex: searchKey, $options: "i" } }],
            };

      const fetchAllEmployees = await this.model
        .find({
          $and: [{ companyId: companyId }, searchFilter],
        })
        .sort(filter)
        .skip((pageNumber - 1) * limit)
        .limit(limit);

      const totalFilteredDocuments = await this.model.countDocuments({ companyId, ...searchFilter });
      const totalPages = Math.ceil(totalFilteredDocuments / limit);
      return { employees: fetchAllEmployees, totalPages };
    } catch (error) {
      console.log("error while fetching employee data", error);
      throw error;
    }
  }

  async updateEmployeeStatus(email: string, isBlock: boolean): Promise<IEmployee | null> {
    try {
      return await this.updateUserStatus(email, isBlock);
    } catch (error) {
      throw error;
    }
  }

  async findEmployeeWithDept(
    companyId: string,
    departementId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ employees: IEmployee[] | null; totalPages: number }> {
    try {
      const limit = 4;
      const pageNumber = Math.max(1, page);
      const filter: Record<string, 1 | -1> = {
        [sort]: sort === "createdAt" ? -1 : 1,
      };

      const searchFilter =
        searchKey.trim() === ""
          ? {}
          : {
              $or: [{ name: { $regex: searchKey, $options: "i" } }, { email: { $regex: searchKey, $options: "i" } }],
            };

      const fetchEmployeesByDept = await this.model
        .find({
          $and: [{ companyId: companyId }, { departmentId: departementId }, searchFilter],
        })
        .sort(filter)
        .skip((pageNumber - 1) * limit)
        .limit(limit);

      const totalFilteredDocuments = await this.model.countDocuments({
        companyId,
        departmentId: departementId,
        ...searchFilter,
      });
      const totalPages = Math.ceil(totalFilteredDocuments / limit);
      return { employees: fetchEmployeesByDept, totalPages };
    } catch (error) {
      throw error;
    }
  }

  async updateImageUrl(email: string, imageUrl: string): Promise<string | null> {
    try {
      const result = await this.model.findOneAndUpdate(
        { email },
        { $set: { imageUrl: imageUrl } },
        { upsert: true, new: true, projection: { _id: 0, imageUrl: 1 } }
      );

      return result ? imageUrl : null;
    } catch (error) {
      throw error;
    }
  }

  async findEmployeesBasedOnDept(
    id: string,
    authUserUUID: string
  ): Promise<{ _id: string; name: string; email: string }[] | null> {
    try {
      const result = await this.model
        .find({ departmentId: id, authUserUUID: authUserUUID })
        .sort({ liveTicket: 1 })
        .select("_id , name , email")
        .lean();

      return result
        ? result.map((emp) => ({
            _id: emp._id.toString(), // Explicitly convert _id to string
            name: emp.name,
            email: emp.email,
          }))
        : null;
    } catch (error) {
      throw error;
    }
  }

  async findEmployeeWithlessTicket(
    id: string,
    authUserUUID: string
  ): Promise<{ _id: string; name: string; email: string } | null> {
    try {
      const employee = await this.model
        .findOne({ departmentId: id, authUserUUID: authUserUUID })
        .sort({ liveTicket: 1 });

      return employee
        ? {
            _id: employee._id as string,
            name: employee.name,
            email: employee.email,
          }
        : null;
    } catch (error) {
      throw error;
    }
  }

  async findAndUpdateTicketCount(id: string, value: number): Promise<IEmployee | null> {
    try {
      const updateCount = await this.model.findOneAndUpdate(
        { _id: id },
        { $inc: { liveTicket: value } },
        { new: true }
      );
      return updateCount;
    } catch (error) {
      throw error;
    }
  }

  async changeDepartmentRepo(
    searchQuery: Record<string, string>,
    updateData: Record<string, string>
  ): Promise<IEmployee | null> {
    try {
      return await this.updateOneDocument(searchQuery, updateData);
    } catch (error) {
      throw error;
    }
  }

  async findOneDoc(searchQuery: Record<string, string>): Promise<IEmployee | null> {
    try {
      return await this.findOneDocument(searchQuery)
    } catch (error) {
      throw error
    }
  }
}

export default new EmployeeRepository();
