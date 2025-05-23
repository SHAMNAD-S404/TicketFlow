import { IBaseResponse } from "../../interfaces/IBaseResponse";
import { IDepartment } from "../../models/interface/IDepartementModel";

export interface IDepartmentService {
  createDepartment(
    departmentData: Partial<IDepartment>
  ): Promise<IBaseResponse>;

  getAllDepartmentNameList(companyID: string): Promise<{
    message: string;
    success: boolean;
    statusCode : number;
    data?: { _id: string; name: string }[];
  }>;

  getAllDepartmentData(authUserUUID: string): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: { _id: string; departmentName: string; responsibilities: string }[];
  }>;

  getUpdatedDepartmentData(
    id: string,
    departementName: string,
    responsibilities: string,
    authUserUUID: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    data?: {
      _id: string;
      departmentName: string;
      responsibilities: string;
    };
  }>;

  deleteDepartementService(id: string): Promise<IBaseResponse>;
}
