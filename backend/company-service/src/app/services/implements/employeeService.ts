import { IEmployee } from "../../models/interface/IEmployeeModel";
import EmployeeRepository from "../../repositories/implements/employee";
import { IEmployeeAuthData } from "../../interfaces/IEmployeeAuthData";
import { Messages } from "../../../constants/messageConstants";
import { HttpStatus } from "../../../constants/httpStatus";
import { IBaseResponse } from "../../interfaces/IBaseResponse";
import {
  AddEmployeesResponse,
  FetchEmployeeDataResponse,
  IChangeDepartmentData,
  IEmployeeService,
  IGetEmployeeWithlessTicket,
  IUpdateProfileImage,
} from "../interface/IEmployeeService";

/**
 * @class EmployeeService
 * @description Implements the core business logic for managing employee-related operations.
 * This service processes requests from controllers and interacts with data access layers
 * (e.g., repositories) for employee data persistence and retrieval.
 * @implements {IEmployeeService}
 */

export default class EmployeeService implements IEmployeeService {

//========================= CREATE EMPLOYEE DOCUMENT =============================================

  async addEmployees(employeeData: IEmployee): Promise<AddEmployeesResponse> {

      const employeeExist = await EmployeeRepository.checkEmployeeExistByEmail(employeeData.email);

      if (employeeExist) {
        return {
          message: Messages.USER_ALREADY_EXIST,
          success: false,
          statusCode : HttpStatus.BAD_REQUEST
        };
      }
      // create employee docunent
      const storeEmployeeData = await EmployeeRepository.createEmployee(employeeData);

      if (!storeEmployeeData) {
        return {
            message: Messages.FAIL_TRY_AGAIN,
            success: false,
            statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // employee payload for sending to auth service queue
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
        statusCode : HttpStatus.OK
      };
  
  }

//========================= FETCH EMPLOYEE DATA =============================================

  async fetchEmployeeData(
    email: string
  ): Promise<FetchEmployeeDataResponse> {
  
      const getUserData = await EmployeeRepository.getEmployeeData(email);

      if (!getUserData) {
        return {
           message: Messages.USER_NOT_FOUND,
           success: false,
           statusCode : HttpStatus.NOT_FOUND
          };
      }

      return {
        message: Messages.FETCH_SUCCESS,
        success: true,
        data: getUserData,
        statusCode : HttpStatus.OK
      };
  }

//========================= UPDATE EMPLOYEE PROFILE =============================================

  async updateEmployeeProfile(
    email: string,
    updateData: Partial<IEmployee>
  ): Promise<FetchEmployeeDataResponse> {

      const isExist = await EmployeeRepository.findOneWithEmail(email);

      if (!isExist) {
        return { 
          message: Messages.USER_NOT_FOUND,
          success: false,
          statusCode : HttpStatus.NOT_FOUND
        
        };
      }
      // update employee profile
      const updatedEmployee = await EmployeeRepository.getUpdatedEmployee(email, updateData);
      if (!updatedEmployee) {
        return { 
          message: Messages.FAIL_TRY_AGAIN,
          success: false,
          statusCode : HttpStatus.BAD_REQUEST
         };
      }

      return {
        message: Messages.UPDATE_SUCCESS,
        success: true,
        statusCode : HttpStatus.OK
      };
  }

//========================= GET ALL EMPLOYEES IN A COMPANY =============================================


  async fetchAllEmployees(
    companyId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { employees: IEmployee[] | null; totalPages: number };
  }> {
      // get all employees in a company 
      const result = await EmployeeRepository.findAllEmployees(companyId, page, sort, searchKey);
      if (result) {
        return {
          message: Messages.FETCH_SUCCESS,
          statusCode: HttpStatus.OK,
          success: true,
          data: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
  }

//========================= EMPLOYEE BLOCK STATUS CHANGE HANDLING =============================================

  async employeeStatusChange(
    email: string,
    isBlock: boolean
  ): Promise<IBaseResponse> {

      if (!email || typeof isBlock !== "boolean") {
        return {
          message: Messages.ALL_FILED_REQUIRED_ERR,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      const findEmployee = await EmployeeRepository.findOneWithEmail(email);
      if (!findEmployee) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      // update employee status
      const updateStatus = await EmployeeRepository.updateEmployeeStatus(email, isBlock);
      if (!updateStatus) {
        return {
          message: Messages.FAIL_TRY_AGAIN,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      return {
        message: Messages.USER_STATUS_UPDATED,
        success: true,
        statusCode: HttpStatus.OK,
      };
  }

//========================= FETCH ALL  EMPLOYEES =============================================

  async fetchDeptEmployees(
    companyId: string,
    departementId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { employees: IEmployee[] | null; totalPages: number };
  }> {

    // get employees with department id
      const result = await EmployeeRepository.findEmployeeWithDept(
        companyId,
        departementId,
        page,
        sort,
        searchKey
      );

      if (result) {
        return {
          statusCode: HttpStatus.OK,
          message: Messages.FETCH_SUCCESS,
          success: true,
          data: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
  }

//========================= UPDATE PROFILE IMAGE ===================================================

  async updateProfileImage(email: string, imageUrl: string): Promise<IUpdateProfileImage> {

      // update profile image url
      const result = await EmployeeRepository.updateImageUrl(email, imageUrl);
      if (result) {
        return {
          message: Messages.IMAGE_UPDATED,
          success: true,
          statusCode: HttpStatus.OK,
          imageUrl: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
  }

//========================= GET EMPLOYEES DEPARTMENT WISE =============================================

  async getEmployeesDeptWise(
    id: string,
    authUserUUID: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { _id: string; name: string; email: string }[];
  }> {

      // Get employees department wise
      const result = await EmployeeRepository.findEmployeesBasedOnDept(id, authUserUUID);
      if (result) {
        return {
          message: Messages.FETCH_SUCCESS,
          statusCode: HttpStatus.OK,
          success: true,
          data: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
  }

//========================= GET EMPLOYEE WITH LESS TICKET HANDLING =============================================

  async getEmployeeWithlessTicket(
    id: string,
    authUserUUID: string
  ): Promise<IGetEmployeeWithlessTicket> {

      const result = await EmployeeRepository.findEmployeeWithlessTicket(id, authUserUUID);

      return result
        ? {
            message: Messages.FETCH_SUCCESS,
            success: true,
            statusCode: HttpStatus.OK,
            data: result,
          }
        : {
            message: Messages.DATA_NOT_FOUND,
            success: false,
            statusCode: HttpStatus.BAD_REQUEST,
          };
  }

//========================= UPDATE TICKET COUNT OF EMPLOYEE =============================================

  async updateTicketCount(id: string, value: number): Promise<IEmployee | null> {
   
      const updateData = await EmployeeRepository.findAndUpdateTicketCount(id, Number(value));
      return updateData ? updateData : null;
  }

//========================= CHANGE EMPLOYEE DEPARTMENT =============================================

  async changeDepartmentService(data: IChangeDepartmentData): Promise<IBaseResponse> {
   
      const { employeeId, ...updationData } = data;
      const isExist = await EmployeeRepository.findOneDoc({ _id: employeeId });
      if (!isExist) {
        return {
          message: Messages.USER_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      const updateData = await EmployeeRepository.changeDepartmentRepo(
        { _id: employeeId },
        updationData
      );
      if (!updateData) {
        return {
          message: Messages.SOMETHING_WRONG,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      return {
        message: Messages.DEPT_CHANGE_SUCCESS,
        success: true,
        statusCode: HttpStatus.OK,
      };
  }
//========================= *************************************** ==================================================
}
