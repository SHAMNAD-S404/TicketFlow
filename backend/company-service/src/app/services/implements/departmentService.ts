import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { IDepartment } from "../../models/interface/IDepartementModel";
import DepartmentRepository from "../../repositories/implements/departement";
import { IDepartmentService } from "../interface/IDepartmentService";
import { normalizeDepartmentName } from "../../../utils/normalizeName";
import { IBaseResponse } from "../../interfaces/IBaseResponse";
import EmployeeRepository from "../../repositories/implements/employee";

export default class DepartmentService implements IDepartmentService {
  async createDepartment(departmentData: IDepartment): Promise<{ message: string; success: boolean }> {
    try {
      const { companyId, departmentNameNormalized } = departmentData;
      const existingDept = await DepartmentRepository.getDepartmentWithTwoFields(
        companyId.toString(),
        departmentNameNormalized
      );
      if (existingDept) {
        return { message: Messages.DEPARTMENT_NAME_EXIST, success: false };
      }

      const result = await DepartmentRepository.createDepartment(departmentData);
      if (result) {
        return {
          message: `${result.departmentName} is created !`,
          success: true,
        };
      } else {
        return { message: "failed to store . try again later", success: false };
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllDepartmentNameList(companyID: string): Promise<{
    message: string;
    success: boolean;
    data?: { _id: string; name: string }[];
  }> {
    try {
      const departmentList = await DepartmentRepository.fetchAllDepartmentsByCompanyId(companyID);
      if (departmentList.length === 0) {
        return {
          message: "departments not found! Add  departments first. then try again !",
          success: false,
        };
      }

      return {
        message: "data fetched successfully",
        success: true,
        data: departmentList,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllDepartmentData(authUserUUID: string): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { _id: string; departmentName: string; responsibilities: string }[];
  }> {
    try {
      const allDepartmentData = await DepartmentRepository.findAllDepartmentData(authUserUUID);
      if (allDepartmentData.length === 0) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      return {
        message: Messages.FETCH_SUCCESS,
        success: true,
        statusCode: HttpStatus.OK,
        data: allDepartmentData,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUpdatedDepartmentData(
    id: string,
    departementName: string,
    responsibilities: string,
    authUserUUID: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { _id: string; departmentName: string; responsibilities: string };
  }> {
    try {
      const getNormalizeDepartmentName = normalizeDepartmentName(departementName);

      //await DepartmentRepository.findWithTwoFields()

      const departmentExist = await DepartmentRepository.findDepartmentWithUUIDAndName(
        authUserUUID,
        getNormalizeDepartmentName
      );

      if (departmentExist) {
        return { message: Messages.DEPARTMENT_NAME_EXIST, statusCode: HttpStatus.BAD_REQUEST, success: false };
      }

      const udpateData = await DepartmentRepository.updateDepartmentData(
        id,
        departementName,
        responsibilities,
        getNormalizeDepartmentName
      );
      if (!udpateData) {
        return { message: Messages.DATA_NOT_FOUND, success: false, statusCode: HttpStatus.BAD_REQUEST };
      }

      return {
        message: Messages.FETCH_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        data: udpateData,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteDepartementService(id: string): Promise<IBaseResponse> {
    try {
      const isExist = await DepartmentRepository.getDepartmentById(id);
      if (!isExist) {
        return { message: Messages.DATA_NOT_FOUND, success: false, statusCode: HttpStatus.NOT_FOUND };
      }
      const isExistEmployees = await EmployeeRepository.findOneDoc({ departmentId: id });
      if (isExistEmployees) {
        return {
          message: Messages.DEPT_HAVE_EMPLOYEES,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      const deleteDoc = await DepartmentRepository.deleteDepartment(id);
      if (deleteDoc) {
        return {
          message: Messages.DEPT_DELETE_SUCCESS,
          success: true,
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          message: Messages.SOMETHING_WRONG,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
