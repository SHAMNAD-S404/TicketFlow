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
            return  result
        } catch (error) {
            throw error;
        }
    }

    async findByName(departmentName: string): Promise<T | null> {
        try {
            const result = await this.model.findOne({departmentName});
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findWithTwoFields(field1: string, field2: string): Promise<T | null> {
        try {
            const result = await this.model.findOne({companyId:field1,departmentName:field2});
            return result ;
        } catch (error) {
            throw error
        }
    }

    async findCompanyWithUUID(userUUID: string): Promise<T | null> {
        try {
            const result = await this.model.findOne({authUserUUID:userUUID});
            return result;
        } catch (error) {
            throw error;
        }
    }
}