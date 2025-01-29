import { IDepartment } from "../../models/interface/IDepartementModel";

export interface IDepartmentService {
    createDepartment(departmentData:Partial<IDepartment>) : Promise<{message:string,success:boolean}>;
    getAllDepartmentNameList(companyID : string) : Promise<{message:string,success:boolean,data?:{_id:string,name:string}[] }>
   
}