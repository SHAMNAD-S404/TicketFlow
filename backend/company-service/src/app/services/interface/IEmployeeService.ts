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

export interface IChangeDepartmentData {
  employeeId: string;
  departmentId: string;
  departmentName: string;
}

export interface AddEmployeesResponse extends IBaseResponse {
  authData?: IEmployeeAuthData
}

export interface FetchEmployeeDataResponse extends IBaseResponse {
  data?: IEmployee
}


//========================= INTERFACE FOR EMPLOYEE SERVICE =============================================

export interface IEmployeeService {

  addEmployees(
    employeeData: IEmployee
  ): Promise<AddEmployeesResponse>;


  fetchEmployeeData(
    email: string
  ): Promise<FetchEmployeeDataResponse>;
  

  updateEmployeeProfile(
    email: string,
    updateData: Partial<IEmployee>
  ): Promise<FetchEmployeeDataResponse>;

  
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

  updateTicketCount(id: string, value: number): Promise<IEmployee | null>;

  changeDepartmentService(data: IChangeDepartmentData): Promise<IBaseResponse>;
}
