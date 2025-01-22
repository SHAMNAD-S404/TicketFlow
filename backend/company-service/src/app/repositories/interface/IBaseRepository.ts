export interface IBaseRepository<T> {
    create(data: Partial<T>) : Promise<T>;
    findOneWithEmail(email:string) : Promise<T | null>;
    findOneById(userId:string) : Promise<T | null>
    // create(item:T) : Promise<T>;
    // findOne(filter:Partial<T>): Promise<T | null>;
    // findById(id:string): Promise<T | null>;
    // findAll(): Promise<T[]>;
    // update(filter:Partial<T>,updates:Partial<T>): Promise<T | null>;
    // delete(filter:Partial<T>): Promise<T | null>;

}