import { Request , Response } from "express";

export interface IDepartmentController {
    createDepartment(req:Request,res:Response) : Promise<void>;
    getAllDepartmentList(req:Request,res:Response) : Promise<void>
    getAllDepartmentData(req : Request ,res:Response) : Promise<void>
    updateDepartment (req:Request , res:Response) : Promise<void>
    deleteDepartment ( req: Request, res:Response) : Promise<void>
}