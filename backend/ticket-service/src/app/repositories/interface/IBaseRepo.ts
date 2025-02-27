export interface IBaseRepository <T> {
    create(data:Partial<T>) : Promise<T>;
    findOneWithSingleField (query:Record<string,string>) : Promise<T | null>;
}