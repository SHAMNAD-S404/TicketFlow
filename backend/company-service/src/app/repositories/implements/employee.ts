import { IEmployeeRepo } from "../interface/IEmployeeRepo";
import { IEmployee } from "../../models/interface/IEmployeeModel";
import EmployeeModel from "../../models/implements/employee";
import { BaseRepository } from "./baseRepository";


/**
 * @class EmployeeRepository
 * @augments BaseRepository<IEmployee>
 * @implements IEmployeeRepo
 * @description Manages data access operations for the Employee entity.
 * Provides a concrete implementation for interacting with the employee collection in the database.
 */


class EmployeeRepository extends BaseRepository<IEmployee> implements IEmployeeRepo {

  /**
   * @constructor
   * @description Initializes the EmployeeRepository with the Mongoose `EmployeeModel`.
   */

  constructor() {
    super(EmployeeModel);
  }

//========================= CREATE EMPLOYE  ==========================================================

  async createEmployee(employeeData: IEmployee): Promise<IEmployee | null> {
    return await this.create(employeeData);
  }

//========================= CHECK EMPLOYEE EXIST ======================================================

  async checkEmployeeExistByEmail(email: string): Promise<IEmployee | null> {
    return await this.isUserExistByEmail(email);
  }

//========================= GET EMPLOYEE DATA =========================================================

  async getEmployeeData(email: string): Promise<IEmployee | null> {
    const employeeData = await this.findOneWithEmail(email);
    return employeeData;
  }

//========================= UPDATE EMPLOYEE DOCS =======================================================

  async getUpdatedEmployee(
    email: string,
    updateData: Partial<IEmployee>
  ): Promise<IEmployee | null> {
    const updatedEmployee = await this.updatByEmail(email, updateData);
    return updatedEmployee;
  }

//========================= FIND ALL EMPLOYEES ==========================================================

  async findAllEmployees(
    companyId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ employees: IEmployee[] | null; totalPages: number }> {
    const limit = 6;
    const pageNumber = Math.max(1, page);
    const filter: Record<string, 1 | -1> = {
      [sort]: sort === "createdAt" ? -1 : 1,
    };

    const searchFilter =
      searchKey.trim() === ""
        ? {}
        : {
            $or: [
              { name: { $regex: searchKey, $options: "i" } },
              { email: { $regex: searchKey, $options: "i" } },
            ],
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
  }

//========================= UPDATE EMPLOYEE STATUS ===================================================

  async updateEmployeeStatus(email: string, isBlock: boolean): Promise<IEmployee | null> {
    return await this.updateUserStatus(email, isBlock);
  }

//========================= FIND EMPLOYEE  WITH DEPT ID =============================================

  async findEmployeeWithDept(
    companyId: string,
    departementId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ employees: IEmployee[] | null; totalPages: number }> {
    const limit = 4;
    const pageNumber = Math.max(1, page);
    const filter: Record<string, 1 | -1> = {
      [sort]: sort === "createdAt" ? -1 : 1,
    };

    const searchFilter =
      searchKey.trim() === ""
        ? {}
        : {
            $or: [
              { name: { $regex: searchKey, $options: "i" } },
              { email: { $regex: searchKey, $options: "i" } },
            ],
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
  }

//========================= UPDATE IMAGE URL =========================================================

  async updateImageUrl(email: string, imageUrl: string): Promise<string | null> {
    const result = await this.model.findOneAndUpdate(
      { email },
      { $set: { imageUrl: imageUrl } },
      { upsert: true, new: true, projection: { _id: 0, imageUrl: 1 } }
    );

    return result ? imageUrl : null;
  }

//========================= FIND EMPLOYEE BASED ON DEPARTMENT ==========================================

  async findEmployeesBasedOnDept(
    id: string,
    authUserUUID: string
  ): Promise<{ _id: string; name: string; email: string }[] | null> {
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
  }

//========================= FIND EMPLOYEE WITH LESS TICKETS =============================================

  async findEmployeeWithlessTicket(
    id: string,
    authUserUUID: string
  ): Promise<{ _id: string; name: string; email: string } | null> {
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
  }

//========================= FIND AND UPDATE TICKET COUNT =============================================

  async findAndUpdateTicketCount(id: string, value: number): Promise<IEmployee | null> {
    const updateCount = await this.model.findOneAndUpdate(
      { _id: id },
      { $inc: { liveTicket: value } },
      { new: true }
    );
    return updateCount;
  }

//========================= CHANGE DEPARTMENT REPO ====================================================

  async changeDepartmentRepo(
    searchQuery: Record<string, string>,
    updateData: Record<string, string>
  ): Promise<IEmployee | null> {
    return await this.updateOneDocument(searchQuery, updateData);
  }

//========================= FIND ONE DOCUMENT ===========================================================

  async findOneDoc(searchQuery: Record<string, string>): Promise<IEmployee | null> {
    return await this.findOneDocument(searchQuery);
  }
}

export default new EmployeeRepository();
