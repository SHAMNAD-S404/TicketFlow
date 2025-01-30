import { IEmployeeService } from "../interface/IEmployeeService";
import { IEmployee } from "../../models/interface/IEmployeeModel";
import EmployeeRepository from "../../repositories/implements/employee";
import { IEmployeeAuthData } from "../../interfaces/IEmployeeAuthData";

export default class EmployeeService implements IEmployeeService {
  async addEmployees(
    employeeData: IEmployee
  ): Promise<{
    message: string;
    success: boolean;
    authData?: IEmployeeAuthData;
  }> {
    try {
      const employeeExist = await EmployeeRepository.checkEmployeeExistByEmail(
        employeeData.email
      );

      if (employeeExist) {
        return {
          message: "employee in this email id already exist ! re-verify email",
          success: false,
        };
      }

      const storeEmployeeData = await EmployeeRepository.createEmployee(
        employeeData
      );
      if (!storeEmployeeData) {
        return { message: "failed to create employee", success: false };
      }

      const employeeAuthData: IEmployeeAuthData = {
        email: storeEmployeeData.email,
        role: storeEmployeeData.role as string,
        authUserUUID: storeEmployeeData.authUserUUID,
        isFirstLogin: true,
      };

      return {
        message: `successfully registered for ${storeEmployeeData.email}`,
        success: true,
        authData: employeeAuthData,
      };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  async fetchEmployeeData(email: string): Promise<{ message: string; success: boolean; data?: IEmployee; }> {
    try {

      const getUserData = await EmployeeRepository.getEmployeeData(email);
      if(!getUserData){
        return {message: "employee data not found",success: false}
      }

      return {message : "fetched successfully",success:true,data:getUserData}
      
    } catch (error) {
      return { message: String(error), success: false };

    }
  }

  async updateEmployeeProfile(email: string, updateData: Partial<IEmployee>): Promise<{ message: string; success: boolean; data?: IEmployee; }> {
    try {

      const isExist = await EmployeeRepository.findOneWithEmail(email)
      if(!isExist){
        return {message: "user not found",success:false}
      }
      const updatedEmployee = await EmployeeRepository.getUpdatedEmployee(email,updateData);
      if(!updatedEmployee){
        return {message: "failed to update try agian",success:false}
      }

      return {message : "user profile updated successfull",success:true}
      
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

}
