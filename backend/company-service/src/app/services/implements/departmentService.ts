import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { IDepartment } from "../../models/interface/IDepartementModel";
import DepartmentRepository from "../../repositories/implements/departement";
import { IDepartmentService } from "../interface/IDepartmentService";
import { normalizeDepartmentName } from "../../../utils/normalizeName";
import { IBaseResponse } from "../../interfaces/IBaseResponse";
import EmployeeRepository from "../../repositories/implements/employee";




/**
 * @class DepartmentService
 * @description Implements the core business logic for managing department-related operations.
 * This service processes requests from controllers and interacts with data access layers
 * (e.g., repositories) for department data persistence and retrieval.
 * @implements {IDepartmentService}
 */

export default class DepartmentService implements IDepartmentService {

//========================= CREATE DEPARTMENT =============================================

  async createDepartment(
    departmentData: IDepartment
  ): Promise<IBaseResponse> {

      const { companyId, departmentNameNormalized } = departmentData;

      // Checking for if the department is existing or not 
      const existingDept = await DepartmentRepository.getDepartmentWithTwoFields(
        companyId.toString(),
        departmentNameNormalized
      );
      // if department already exist
      if (existingDept) {
        return { 
          message: Messages.DEPARTMENT_NAME_EXIST,
          success: false,
          statusCode : HttpStatus.BAD_REQUEST
        };
      }

      // create department 
      const result = await DepartmentRepository.createDepartment(departmentData);
      if (result) {
        return {
          message: `${result.departmentName} is created !`,
          success: true,
          statusCode : HttpStatus.OK
        };
      } else {
        return {
            message: Messages.FAIL_TRY_AGAIN,
            success: false,
            statusCode : HttpStatus.BAD_REQUEST
           };
      }
  }

//========================= GET ALL DEPARTMENT LIST =============================================

  async getAllDepartmentNameList(companyID: string): Promise<{
    message: string;
    success: boolean;
    statusCode : number;
    data?: { _id: string; name: string }[];
  }> {
      // getting all department document 
      const departmentList = await DepartmentRepository.fetchAllDepartmentsByCompanyId(companyID);
      // If department document didn't exist
      if (departmentList.length === 0) {
        return {
          message: "departments not found! Add  departments first. then try again !",
          success: false,
          statusCode : HttpStatus.BAD_REQUEST
        };
      }

      return {
        message: Messages.FETCH_SUCCESS,
        success: true,
        data: departmentList,
        statusCode : HttpStatus.OK
      };
  }

//========================= GET ALL DEPARTMENT DATA  =============================================

  async getAllDepartmentData(authUserUUID: string): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { _id: string; departmentName: string; responsibilities: string }[];
  }> {

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
  }

//========================= UPDATE DEPARTMENT DATA =============================================

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

      // Get normalise department name for verification for the department name is exist or not
      const getNormalizeDepartmentName = normalizeDepartmentName(departementName);
      //check for department exist
      const departmentExist = await DepartmentRepository.findDepartmentWithUUIDAndName(
        authUserUUID,
        getNormalizeDepartmentName
      );

      if (departmentExist) {
        return {
          message: Messages.DEPARTMENT_NAME_EXIST,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

      // update department data
      const udpateData = await DepartmentRepository.updateDepartmentData(
        id,
        departementName,
        responsibilities,
        getNormalizeDepartmentName
      );

      if (!udpateData) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      // if its success
      return {
        message: Messages.FETCH_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        data: udpateData,
      };
  }

//========================= DELETE DEPARTMENT =============================================

  async deleteDepartementService(id: string): Promise<IBaseResponse> {

      const isExist = await DepartmentRepository.getDepartmentById(id);
      if (!isExist) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      // checking for any employees is existing in that department or not 
      const isExistEmployees = await EmployeeRepository.findOneDoc({ departmentId: id });
      if (isExistEmployees) {
        return {
          message: Messages.DEPT_HAVE_EMPLOYEES,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      // if department have no employees then delete 
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
  }

//========================= ***************************************** =============================================

}
