import { IDepartment } from "../../models/interface/IDepartementModel";

export interface IDepartmentRepo {

    createDepartment(departmentData:IDepartment) : Promise<IDepartment |  null>;

    getDepartmentByName(departmentName:string) : Promise<IDepartment | string | null >;

    getDepartmentWithTwoFields(field1:string,field2:string) : Promise<IDepartment |null>;

    fetchAllDepartmentsByCompanyId(companyId:string) : Promise<{_id:string,name:string}[]>

    fetchAllDepartmentData(authUserUUID:string) : Promise<{_id:string,departmentName:string,responsibilities:string}[]>
    
    updateDepartmentData (id:string,departementName:string,responsibilities:string,getNormalizeDepartmentName:string) :
         Promise<{_id:string,departmentName:string,responsibilities:string}|null>

    findDepartmentWithUUIDAndName(authUserUUID:string,departmentNameNormalized:string) : Promise<boolean>
    
    deleteDepartment(id:string) : Promise<boolean>
    
}