import { IEmployee } from "../../models/interface/IEmployeeModel";
import { IEmployeeAuthData } from "../../interfaces/IEmployeeAuthData";
import { IBaseResponse } from "../../interfaces/IBaseResponse";

export interface IUpdateProfileImage extends IBaseResponse {
  imageUrl?: string;
}

export interface IGetEmployeeWithlessTicket extends IBaseResponse {
  data?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface IEmployeeService {
  addEmployees(employeeData: IEmployee): Promise<{ message: string; success: boolean; authData?: IEmployeeAuthData }>;

  fetchEmployeeData(email: string): Promise<{ message: string; success: boolean; data?: IEmployee }>;

  updateEmployeeProfile(
    email: string,
    updateData: Partial<IEmployee>
  ): Promise<{ message: string; success: boolean; data?: IEmployee }>;

  fetchAllEmployees(
    companyId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { employees: IEmployee[] | null; totalPages: number };
  }>;

  fetchDeptEmployees(
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
  }>;

  employeeStatusChange(email: string, isBlock: boolean): Promise<IBaseResponse>;

  updateProfileImage(email: string, imageUrl: string): Promise<IUpdateProfileImage>;

  getEmployeesDeptWise(
    id: string,
    authUserUUID: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { _id: string; name: string; email: string }[];
  }>;

  getEmployeeWithlessTicket(id: string, authUserUUID: string): Promise<IGetEmployeeWithlessTicket>;
}
