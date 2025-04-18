import { Model, Document } from "mongoose";
import { IDepartmentBaseRepo } from "../interface/baseDepartmentRepo";

export class DepartmentBase<T extends Document> implements IDepartmentBaseRepo<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const createDocument = new this.model(data);
      return await createDocument.save();
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findByName(departmentName: string): Promise<T | null> {
    try {
      const result = await this.model.findOne({ departmentName });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findWithTwoFields(field1: string, field2: string): Promise<T | null> {
    try {
      const result = await this.model.findOne({ companyId: field1, departmentNameNormalized: field2 });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findCompanyWithUUID(userUUID: string): Promise<T | null> {
    try {
      const result = await this.model.findOne({ authUserUUID: userUUID });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findDepartmentsListByCompanyId(companyId: string): Promise<{ _id: string; name: string }[]> {
    try {
      // Fetch only the `name` and `_id` fields and return plain JavaScript objects
      const departments = await this.model
        .find(
          { companyId }, // Filter by companyId
          { departmentName: 1, companyId: 1, responsibilities: 1 } // Select only the `name` and `_id` fields
        )
        .lean()
        .exec();

      return departments as { _id: string; name: string }[];
    } catch (error) {
      console.error("Error fetching departments by companyId:", error);
      throw new Error("Could not fetch departments.");
    }
  }

  async findAllDepartmentData(
    authUserUUID: string
  ): Promise<{ _id: string; departmentName: string; responsibilities: string }[]> {
    try {
      const departmentData = await this.model
        .find({ authUserUUID: authUserUUID })
        .select("_id departmentName responsibilities")
        .lean<{ _id: string; departmentName: string; responsibilities: string }[]>();

      return departmentData;
    } catch (error) {
      throw new Error("failed to fetch data from db ");
    }
  }

  async deleteOneDocument(id: string): Promise<boolean> {
    try {
      const result = await this.model.deleteOne({ _id: id });
      return result.acknowledged ? true : false;
    } catch (error) {
      throw error;
    }
  }
}
