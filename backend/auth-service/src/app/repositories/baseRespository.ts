import { Model, Document } from "mongoose";

export class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model; 
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      console.log("hiiiii im inside base repo");
      return await document.save();
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<T | null>{
    try {
       return  await this.model.findOne({email});
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      console.error("Error finding document by ID:", error);
      throw error;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.model.find();
    } catch (error) {
      console.error("Error finding all documents:", error);
      throw error;
    }
  }

  async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error("Error updating document by ID:", error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error deleting document by ID:", error);
      throw error;
    }
  }
}