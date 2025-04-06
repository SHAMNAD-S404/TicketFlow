import {
  IChangeDepartmentData,
  IEmployeeService,
  IGetEmployeeWithlessTicket,
  IUpdateProfileImage,
} from "../interface/IEmployeeService";
import { IEmployee } from "../../models/interface/IEmployeeModel";
import EmployeeRepository from "../../repositories/implements/employee";
import { IEmployeeAuthData } from "../../interfaces/IEmployeeAuthData";
import { Messages } from "../../../constants/messageConstants";
import { HttpStatus } from "../../../constants/httpStatus";
import { IBaseResponse } from "../../interfaces/IBaseResponse";

export default class EmployeeService implements IEmployeeService {
  async addEmployees(employeeData: IEmployee): Promise<{
    message: string;
    success: boolean;
    authData?: IEmployeeAuthData;
  }> {
    try {
      const employeeExist = await EmployeeRepository.checkEmployeeExistByEmail(employeeData.email);

      if (employeeExist) {
        return {
          message: "employee in this email id already exist ! re-verify email",
          success: false,
        };
      }

      const storeEmployeeData = await EmployeeRepository.createEmployee(employeeData);
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

  async fetchEmployeeData(email: string): Promise<{ message: string; success: boolean; data?: IEmployee }> {
    try {
      const getUserData = await EmployeeRepository.getEmployeeData(email);
      if (!getUserData) {
        return { message: "employee data not found", success: false };
      }

      return {
        message: "fetched successfully",
        success: true,
        data: getUserData,
      };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  async updateEmployeeProfile(
    email: string,
    updateData: Partial<IEmployee>
  ): Promise<{ message: string; success: boolean; data?: IEmployee }> {
    try {
      const isExist = await EmployeeRepository.findOneWithEmail(email);
      if (!isExist) {
        return { message: "user not found", success: false };
      }
      const updatedEmployee = await EmployeeRepository.getUpdatedEmployee(email, updateData);
      if (!updatedEmployee) {
        return { message: "failed to update try agian", success: false };
      }

      return { message: "user profile updated successfull", success: true };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

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
    try {
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
    } catch (error) {
      return {
        message: Messages.SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
      };
    }
  }

  async employeeStatusChange(
    email: string,
    isBlock: boolean
  ): Promise<{ message: string; success: boolean; statusCode: number }> {
    try {
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
    } catch (error) {
      console.log("error while updating employee status :", error);
      return {
        message: Messages.SERVER_ERROR,
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

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
    try {
      const result = await EmployeeRepository.findEmployeeWithDept(companyId, departementId, page, sort, searchKey);

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
    } catch (error) {
      throw error;
    }
  }

  async updateProfileImage(email: string, imageUrl: string): Promise<IUpdateProfileImage> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getEmployeesDeptWise(
    id: string,
    authUserUUID: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { _id: string; name: string; email: string }[];
  }> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeWithlessTicket(id: string, authUserUUID: string): Promise<IGetEmployeeWithlessTicket> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async updateTicketCount(id: string, value: number): Promise<IEmployee | null> {
    try {
      const updateData = await EmployeeRepository.findAndUpdateTicketCount(id, Number(value));
      return updateData ? updateData : null;
    } catch (error) {
      throw error;
    }
  }

  async changeDepartmentService(data: IChangeDepartmentData): Promise<IBaseResponse> {
    try {
      const { employeeId, ...updationData } = data;
      const isExist = await EmployeeRepository.findOneDoc({ _id: employeeId });
      if (!isExist) {
        return { message: Messages.USER_NOT_FOUND, success: false, statusCode: HttpStatus.NOT_FOUND };
      }
      const updateData = await EmployeeRepository.changeDepartmentRepo({ _id: employeeId }, updationData);
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
    } catch (error) {
      throw error;
    }
  }
}
