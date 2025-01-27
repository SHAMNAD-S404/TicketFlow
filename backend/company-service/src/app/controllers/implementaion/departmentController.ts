import { Request, Response } from "express";
import { IDepartmentController } from "../interface/IDepartmentController";
import { IDepartmentService } from "../../services/interface/IDepartmentService";
import mongoose from "mongoose";
import { IDepartment } from "../../models/interface/IDepartementModel";

export class DepartmentController implements IDepartmentController {
    private readonly  departmentService : IDepartmentService;

    constructor(DepartmentService : IDepartmentService){
        this.departmentService = DepartmentService;
    }



    public createDepartment = async(req: Request, res: Response): Promise<void> => {

        try {

            const userId = req.query.userId;
            const {departmentName,responsibilities} = req.body;
            if( !userId || !departmentName || !responsibilities){
                res.status(400).json({message:"provide all neccessary dat",success:false});
                return;
            }

            const companyId = new mongoose.Types.ObjectId(userId.toString());

            const departmentData = {
                
                companyId,
                departmentName,
                responsibilities
            };

            const response = await this.departmentService.createDepartment(departmentData);
            const {message,success} = response;
            const statusCode = success ? 200 : 400;
            res.status(statusCode).json({message,success});
            return;

            
        } catch (error) {
            res.status(400).json({message:String(error),success:false})
        }
        
    }
}
