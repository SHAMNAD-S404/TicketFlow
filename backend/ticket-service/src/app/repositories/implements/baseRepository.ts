import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepo";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}


  async create(data: Partial<T>): Promise<T> {
    const createDocument = new this.model(data);
    return await createDocument.save();
  }



  async findOneWithSingleField(query: Record<string, string>): Promise<T | null> {
    return await this.model.findOne(query);
  }



  async findOneDocAndUpdate(
    searchQuery: Record<string, string>,
    updateQuery: Record<string, string | number>
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(searchQuery, updateQuery, { new: true });
  }



  async deleteOneDocument(query: Record<string, string>): Promise<boolean> {
    const result = await this.model.deleteOne(query);
    return result.acknowledged ? true : false;
  }


  
  async getDocumentCount(searchQuery: Record<string, any>): Promise<number> {
    return await this.model.countDocuments(searchQuery);
  }
}
