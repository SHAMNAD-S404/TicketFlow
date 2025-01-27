import { IDepartment } from "../../models/interface/IDepartementModel";
import  DepartmentRepository from '../../repositories/implements/departement';
import { IDepartmentService } from "../interface/IDepartmentService";


export default class DepartmentService implements IDepartmentService {
    

    async createDepartment(departmentData: IDepartment): Promise<{ message: string; success: boolean }> {
        try {

            const {companyId,departmentName,responsibilities} = departmentData;
            const existingDept = await DepartmentRepository.getDepartmentWithTwoFields(companyId.toString(),departmentName);
            if(existingDept){
                return{message:"Departement already exist",success:false}
            }

            

            const result = await DepartmentRepository.createDepartment(departmentData);
            if(result){
                return {message:`${result.departmentName} is created !`,success:true}
            }else{
                return {message:"failed to store . try again later",success:false}
            }

            
        } catch (error) {
            return {message:String(error),success:false}
        }
    }
}