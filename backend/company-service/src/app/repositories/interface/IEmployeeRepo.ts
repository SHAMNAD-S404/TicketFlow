import { IEmployee } from "../../models/interface/IEmployeeModel";

export interface IEmployeeRepo {
  createEmployee(employeeData: IEmployee): Promise<IEmployee | null>;
  getEmployeeData(email: string): Promise<IEmployee | null>;
  getUpdatedEmployee(email: string, updateData: Partial<IEmployee>): Promise<IEmployee | null>;
  findAllEmployees(
    companyId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ employees: IEmployee[] | null; totalPages: number }>;
  findEmployeeWithDept(
    companyId: string,
    departementId: string,
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ employees: IEmployee[] | null; totalPages: number }>;


  
  updateEmployeeStatus(email: string, isBlock: boolean): Promise<IEmployee | null>;
}
