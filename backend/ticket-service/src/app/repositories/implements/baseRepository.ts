import { Model , Document } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepo";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    constructor(protected readonly model:Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        try {
            const createDocument = new this.model(data)
            return await createDocument.save();
        } catch (error) {
            throw error
        }
    }

    async findOneWithSingleField(query: Record<string, string>): Promise<T | null> {
        return await this.model.findOne(query)
    }


}
