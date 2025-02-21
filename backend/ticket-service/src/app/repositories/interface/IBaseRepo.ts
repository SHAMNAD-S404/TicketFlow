export interface IBaseRepository <T> {
    create(data:Partial<T>) : Promise<T>;
}