import {Model,Document} from "mongoose";
import { IBaseRepo } from "../interface/IBaseRepo";
import { INotification } from "../../models/interface/INotification";

export class BaseRepo<T extends Document> implements IBaseRepo<T> {
    constructor(protected readonly model : Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        const createDocument = new this.model(data);
        return await createDocument.save();
    }

    async getDocumentCount(searchQuery: Record<string, any>): Promise<number> {
        return await this.model.countDocuments(searchQuery);
    }

    async updateOneDocument(searchQuery: Record<string, any>, updateQuery: Record<string, any>): Promise<T | null> {
        try {
            return await this.model.findOneAndUpdate(searchQuery,updateQuery,{new: true});
        } catch (error) {
            throw error
        }
    }

    async updateAllDocument(searchQuery: Record<string, any>, updateQuery: Record<string, any>): Promise<void> {
        try {
            await this.model.updateMany(searchQuery,updateQuery)
        } catch (error) {
            throw error
        }
    }

}