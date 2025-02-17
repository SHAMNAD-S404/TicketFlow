import { Request, Response } from "express";

export interface IEmployeeController {
  createEmployee(req: Request, res: Response): Promise<void>;
  getEmployeeData(req: Request, res: Response): Promise<void>;
  updateEmployee(req: Request, res: Response): Promise<void>;
  getAllEmployees(req: Request, res: Response): Promise<void>;
}
