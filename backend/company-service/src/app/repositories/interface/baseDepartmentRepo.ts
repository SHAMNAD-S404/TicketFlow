
export interface IDepartmentBaseRepo<T> {
    create(data:Partial<T>) : Promise<T>
    findById(id:string) : Promise<T |null>
    findByName(departmentName:string) : Promise<T | null>
    findWithTwoFields(field1:string,field2:string) : Promise<T | null>
}