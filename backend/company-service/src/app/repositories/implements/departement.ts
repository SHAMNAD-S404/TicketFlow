import { DepartmentBase } from "./baseDepartments";
import { IDepartmentBaseRepo } from "../interface/baseDepartmentRepo";
import { IDepartment } from "../../models/interface/IDepartementModel";
import DepartmentModel from "../../models/implements/department";
import { IDepartmentRepo } from "../interface/IDepartmentRepo";


class DepartmentRepository extends DepartmentBase<IDepartment> implements IDepartmentRepo {
    constructor(){
        super(DepartmentModel);
    }

    async createDepartment(departmentData: IDepartment): Promise<IDepartment |  null> {
        try {
            return await this.create(departmentData);
            
        } catch (error) {
            throw new Error (`failed to create department. error :, ${error}`)
        }
    } 

    async getDepartmentById(id: string): Promise<any> {
        try {
            return await this.findById(id);
            
        } catch (error) {
            throw error;
        }
    }


    async getDepartmentByName(departmentName: string): Promise<any> {
        try {
            return await this.findByName(departmentName);
        } catch (error) {
            throw error;
        }
    }

    async getDepartmentWithTwoFields(field1: string, field2: string): Promise<IDepartment | null> {
        try {
            
            return await this.findWithTwoFields(field1,field2);
                      
        } catch (error) {
            throw error;
        }
    }



}

export default new DepartmentRepository();