import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepo";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const createDocument = new this.model(data);
      return await createDocument.save();
    } catch (error) {
      throw error;
    }
  }

  async findOneWithSingleField(query: Record<string, string>): Promise<T | null> {
    return await this.model.findOne(query);
  }

  async findOneDocAndUpdate(
    searchQuery: Record<string, string>,
    updateQuery: Record<string, string | number>
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(searchQuery, updateQuery, { new: true  });
  }

  async deleteOneDocument(query: Record<string, string>): Promise<boolean> {
    try {
        const result = await this.model.deleteOne(query);
        return result.acknowledged ? true : false;
    } catch (error) {
      throw error
    }
  }

  async getDocumentCount(searchQuery: Record<string, any>): Promise<number> {
    return await this.model.countDocuments(searchQuery)
  }
  
}
