import { IDepartment } from "../../models/interface/IDepartementModel";

export interface IDepartmentRepo {
    createDepartment(departmentData:IDepartment) : Promise<IDepartment |  null>;
    getDepartmentByName(departmentName:string) : Promise<IDepartment | string | null >;
    getDepartmentWithTwoFields(field1:string,field2:string) : Promise<IDepartment |null>;
}