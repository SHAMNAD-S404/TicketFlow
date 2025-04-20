import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(item: Partial<T>): Promise<T> {
    try {
      const createdDocument = new this.model(item);
      return await createdDocument.save();
    } catch (error) {
      throw error;
    }
  }

  async findOneWithEmail(email: string): Promise<T | null> {
    try {
      const result = await this.model.findOne({ email });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOneByUUID(authUserUUID: string): Promise<T | null> {
    try {
      // Find one document by user ID
      const result = await this.model.findOne({ authUserUUID: authUserUUID });
      return result;
    } catch (error) {
      // If an error occurs, throw it
      throw error;
    }
  }

  async isUserExistByEmail(email: string): Promise<T | null> {
    try {
      const result = await this.model.findOne({ email }).select("_id");
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updatByEmail(email: string, updateData: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate({ email }, updateData, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<T[] | null> {
    try {
      return await this.model.find().select("-updatedAt -__v");
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(email: string, blockStatus: boolean): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate({ email: email }, { $set: { isBlock: blockStatus } }, { new: true });
    } catch (error) {
      console.error("error in base repo update user : ", error);
      throw error;
    }
  }

  async updateOneDocument(searchQuery: Record<string, string>, updateData: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(searchQuery, { $set: updateData }, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async findOneDocument(searchQuery: Record<string, string>): Promise<T | null> {
    try {
       return await this.model.findOne(searchQuery)
    } catch (error) {
      throw error
    }
  }

  //to count the documents based on conditioin
  async getDocumentCount(filter: Record<string, any>): Promise<number> {
    try {
        return await this.model.countDocuments(filter)
    } catch (error) {
      throw error
    }
  }

}
