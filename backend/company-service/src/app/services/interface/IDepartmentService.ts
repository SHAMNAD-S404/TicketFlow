import { IDepartment } from "../../models/interface/IDepartementModel";

export interface IDepartmentService {
    createDepartment(departmentData:Partial<IDepartment>) : Promise<{message:string,success:boolean}>;
   
}