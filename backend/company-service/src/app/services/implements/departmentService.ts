import { IDepartment } from "../../models/interface/IDepartementModel";
import  DepartmentRepository from '../../repositories/implements/departement';
import { IDepartmentService } from "../interface/IDepartmentService";



export default class DepartmentService implements IDepartmentService {
    

    async createDepartment(departmentData: IDepartment): Promise<{ message: string; success: boolean }> {
        try {

            const {companyId,departmentNameNormalized} = departmentData;
            const existingDept = await DepartmentRepository.getDepartmentWithTwoFields(companyId.toString(),departmentNameNormalized);
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

    async getAllDepartmentNameList(companyID : string) : Promise<{message : string,success:boolean, data?: {_id:string , name:string}[] }> {
        try {

            const departmentList = await DepartmentRepository.fetchAllDepartmentsByCompanyId(companyID);
            if(departmentList.length === 0) {
                return {message: "departments not found! Add  departments first. then try again !", success : false}
            }

            return {
                message : "data fetched successfully",
                success : true,
                data : departmentList
            }

        } catch (error) {
                return {message:String(error),success:false}
        }
    }

  
}