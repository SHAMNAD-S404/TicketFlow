import { DepartmentBase } from "./baseDepartments";
import { IDepartment } from "../../models/interface/IDepartementModel";
import DepartmentModel from "../../models/implements/department";
import { IDepartmentRepo } from "../interface/IDepartmentRepo";


/**
 * @class DepartmentRepository
 * @augments DepartmentBase<IDepartment>
 * @implements IDepartmentRepo
 * @description Manages data access operations for the Department entity.
 * Provides a concrete implementation for interacting with the department collection in the database.
 */

class DepartmentRepository extends DepartmentBase<IDepartment> implements IDepartmentRepo {

  /**
   * @constructor
   * @description Initializes the DepartmentRepository with the Mongoose `DepartmentModel`.
   */
  constructor() {
    super(DepartmentModel);
  }

//========================= CREATE DEPARTMENT =============================================

  async createDepartment(departmentData: IDepartment): Promise<IDepartment | null> {
    return await this.create(departmentData);
  }

//========================= FIND DEPARTMENT BY ID =============================================

  async getDepartmentById(id: string): Promise<any> {
    return await this.findById(id);
  }

//========================= FIND DEPARTMENT BY NAME =============================================

  async getDepartmentByName(departmentName: string): Promise<any> {
    return await this.findByName(departmentName);
  }

//========================= GET DEPARTEMENT DOCS WITH TWO FIELDS =================================

  async getDepartmentWithTwoFields(field1: string, field2: string): Promise<IDepartment | null> {
    return await this.findWithTwoFields(field1, field2);
  }

//========================= FETCH ALL DEPARTMENT WITH COMPANY ID =================================

  async fetchAllDepartmentsByCompanyId(
    companyId: string
  ): Promise<{ _id: string; name: string }[]> {
    return await this.findDepartmentsListByCompanyId(companyId);
  }

//========================= FETCH ALL DEPARTMENT DOCS =============================================

  async fetchAllDepartmentData(
    authUserUUID: string
  ): Promise<{ _id: string; departmentName: string; responsibilities: string }[]> {
    return await this.findAllDepartmentData(authUserUUID);
  }

//========================= UPDATE DEPARTMENT DATA =================================================

  async updateDepartmentData(
    id: string,
    departementName: string,
    responsibilities: string,
    getNormalizeDepartmentName: string
  ): Promise<{ _id: string; departmentName: string; responsibilities: string } | null> {
    const result = await this.model
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            departmentName: departementName,
            responsibilities: responsibilities,
            departmentNameNormalized: getNormalizeDepartmentName,
          },
        },
        { new: true }
      )
      .select("_id departmentName responsibilities")
      .lean<{ _id: string; departmentName: string; responsibilities: string } | null>();

    return result;
  }

//========================= FIND DEPARTMENT WITH UUID AND NAME =========================================

  async findDepartmentWithUUIDAndName(
    authUserUUID: string,
    departmentNameNormalized: string
  ): Promise<boolean> {
    const result = await this.model.findOne({
      authUserUUID: authUserUUID,
      departmentNameNormalized: departmentNameNormalized,
    });
    return result ? true : false;
  }

//========================= DELETE DEPARTMENT ===========================================================

  async deleteDepartment(id: string): Promise<boolean> {
    return await this.deleteOneDocument(id);
  }
  
//========================= ******************************** =============================================

}

export default new DepartmentRepository();
