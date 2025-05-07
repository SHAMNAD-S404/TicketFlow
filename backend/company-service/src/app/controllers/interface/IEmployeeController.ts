import { Request, Response } from "express";

export interface IEmployeeController {
  createEmployee(req: Request, res: Response): Promise<void>;
  getEmployeeData(req: Request, res: Response): Promise<void>;
  updateEmployee(req: Request, res: Response): Promise<void>;
  getAllEmployees(req: Request, res: Response): Promise<void>;
  getDepartmentWiseEmployees(req: Request, res: Response): Promise<void>;
  uploadProfileImage(req: Request, res: Response): Promise<void>;
  getEmployeesByDept(req: Request, res: Response): Promise<void>;
  fetchEmployeeWithlessTicket(req: Request, res: Response): Promise<void>;
  changeDepartment (req: Request , res: Response) : Promise<void>;


}
