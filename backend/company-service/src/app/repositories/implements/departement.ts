import { DepartmentBase } from "./baseDepartments";
import { IDepartment } from "../../models/interface/IDepartementModel";
import DepartmentModel from "../../models/implements/department";
import { IDepartmentRepo } from "../interface/IDepartmentRepo";

class DepartmentRepository extends DepartmentBase<IDepartment> implements IDepartmentRepo {
  constructor() {
    super(DepartmentModel);
  }

  async createDepartment(departmentData: IDepartment): Promise<IDepartment | null> {
    try {
      return await this.create(departmentData);
    } catch (error) {
      throw new Error(`failed to create department. error :, ${error}`);
    }
  }

  async getDepartmentById(id: string): Promise<any> {
    try {
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentByName(departmentName: string): Promise<any> {
    try {
      return await this.findByName(departmentName);
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentWithTwoFields(field1: string, field2: string): Promise<IDepartment | null> {
    try {
      return await this.findWithTwoFields(field1, field2);
    } catch (error) {
      throw error;
    }
  }

  async fetchAllDepartmentsByCompanyId(companyId: string): Promise<{ _id: string; name: string }[]> {
    try {
      return await this.findDepartmentsListByCompanyId(companyId);
    } catch (error) {
      throw error;
    }
  }

  async fetchAllDepartmentData(
    authUserUUID: string
  ): Promise<{ _id: string; departmentName: string; responsibilities: string }[]> {
    try {
      return await this.findAllDepartmentData(authUserUUID);
    } catch (error) {
      throw error;
    }
  }

  async updateDepartmentData(
    id: string,
    departementName: string,
    responsibilities: string,
    getNormalizeDepartmentName: string
  ): Promise<{ _id: string; departmentName: string; responsibilities: string } | null> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async findDepartmentWithUUIDAndName(authUserUUID: string, departmentNameNormalized: string): Promise<boolean> {
    try {
      const result = await this.model.findOne({
        authUserUUID: authUserUUID,
        departmentNameNormalized: departmentNameNormalized,
      });
      return result ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async deleteDepartment(id: string): Promise<boolean> {
    return await this.deleteOneDocument(id);
  }
}

export default new DepartmentRepository();
