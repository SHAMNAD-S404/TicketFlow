import { Request,Response } from "express";

export interface IEmployeeController {
    createEmployee(req:Request,res:Response) : Promise<void>;
}