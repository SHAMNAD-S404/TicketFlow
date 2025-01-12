import { Model, Document } from "mongoose";

export class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model; 
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    console.log("hiiiii im inside base repo");
    
    return document.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
