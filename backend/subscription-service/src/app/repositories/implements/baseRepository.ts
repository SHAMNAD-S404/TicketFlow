// src/app/repositories/implementation/baseRepository.ts
import { Model, Document } from 'mongoose';
import { IBaseRepo } from '../interface/IBaseRepo';

export class BaseRepository<T> implements IBaseRepo<T> {
  protected model: Model<T & Document>;

  constructor(model: Model<T & Document>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const created = await this.model.create(data);
    return created.toObject();
  }

  async findById(id: string): Promise<T | null> {
    const found = await this.model.findById(id);
    return found ? found.toObject() : null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const found = await this.model.findOne(filter as any);
    return found ? found.toObject() : null;
  }

  async find(filter: Partial<T>): Promise<T[]> {
    const found = await this.model.find(filter as any);
    return found.map(item => item.toObject());
  }

  async updateOne(filter: Partial<T>, update: Partial<T>): Promise<boolean> {
    const result = await this.model.updateOne(filter as any, update as any);
    return result.modifiedCount > 0;
  }

  async updateById(id: string, update: Partial<T>): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(id, update as any);
    return !!result;
  }

  async deleteOne(filter: Partial<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter as any);
    return result.deletedCount > 0;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}