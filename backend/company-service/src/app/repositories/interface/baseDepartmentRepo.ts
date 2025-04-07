
export interface IDepartmentBaseRepo<T> {
    create(data:Partial<T>) : Promise<T>
    findById(id:string) : Promise<T |null>
    deleteOneDocument(id:string) : Promise<boolean>

    findByName(departmentName:string) : Promise<T | null>
    findWithTwoFields(field1:string,field2:string) : Promise<T | null>
    findCompanyWithUUID(userUUID:string) : Promise <T | null>
    findDepartmentsListByCompanyId(companyId:string) : Promise<{ _id: string; name: string  }[]> ;
    findAllDepartmentData(authUserUUID:string) : Promise<{_id:string,departmentName:string,responsibilities:string}[]>
}