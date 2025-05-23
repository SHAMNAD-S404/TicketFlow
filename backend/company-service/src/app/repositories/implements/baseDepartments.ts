import { Model, Document } from "mongoose";
import { IDepartmentBaseRepo } from "../interface/baseDepartmentRepo";


/**
 * @class DepartmentBase
 * @description Provides a generic base repository for department-related entities,
 * abstracting common database operations. It works with any Mongoose document type
 * that extends `Document`.
 * @implements {IDepartmentBaseRepo<T>}
 * @template T The Mongoose Document type that this repository will operate on.
 */

export class DepartmentBase<T extends Document> implements IDepartmentBaseRepo<T> {

    /**
   * @type {Model<T>}
   * @description The Mongoose model instance used for database interactions for this specific entity.
   */
  constructor(protected readonly model: Model<T>) {}



//========================= CREATE DOCUMENT =======================================
  async create(data: Partial<T>): Promise<T> {
    const createDocument = new this.model(data);
    return await createDocument.save();
  }

//========================= FIND BY ID =============================================

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

//========================= FIND BY NAME =============================================

  async findByName(departmentName: string): Promise<T | null> {
    return await this.model.findOne({ departmentName });
  }

//========================= FIND WITH TWO FIELDS ======================================

  async findWithTwoFields(field1: string, field2: string): Promise<T | null> {
    return await this.model.findOne({
      companyId: field1,
      departmentNameNormalized: field2,
    });
  }

//========================= FIND WITH COMPANY UUID =====================================

  async findCompanyWithUUID(userUUID: string): Promise<T | null> {
    return await this.model.findOne({ authUserUUID: userUUID });
  }

//========================= FIND DEPARTMENT LIST BY COMPANY ID ==========================

  async findDepartmentsListByCompanyId(
    companyId: string
  ): Promise<{ _id: string; name: string }[]> {
    // Fetch only the `name` and `_id` fields and return plain JavaScript objects
    const departments = await this.model
      .find(
        { companyId }, // Filter by companyId
        { departmentName: 1, companyId: 1, responsibilities: 1 } // Select only the `name` and `_id` fields
      )
      .lean()
      .exec();

    return departments as { _id: string; name: string }[];
  }

//========================= FIND ALL DEPARTMENT DATA ====================================

  async findAllDepartmentData(
    authUserUUID: string
  ): Promise<{ _id: string; departmentName: string; responsibilities: string }[]> {
    return await this.model
      .find({ authUserUUID: authUserUUID })
      .select("_id departmentName responsibilities")
      .lean<{ _id: string; departmentName: string; responsibilities: string }[]>();
  }

//========================= DELETE ONE DOCUMENT ============================================

  async deleteOneDocument(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.acknowledged ? true : false;
  }
}
