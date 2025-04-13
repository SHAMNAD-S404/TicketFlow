
export interface IBaseRepo<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: Partial<T>): Promise<T | null>;
    find(filter: Partial<T>): Promise<T[]>;
    updateOne(filter: Partial<T>, update: Partial<T>): Promise<boolean>;
    updateById(id: string, update: Partial<T>): Promise<boolean>;
    deleteOne(filter: Partial<T>): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
  }