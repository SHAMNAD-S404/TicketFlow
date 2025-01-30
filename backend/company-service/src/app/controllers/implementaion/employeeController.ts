import { IEmployeeController } from "../interface/IEmployeeController";
import { Request,Response } from "express";
import { IEmployeeService } from "../../services/interface/IEmployeeService";
import EmployeeModel from "../../models/implements/employee";
import mongoose from "mongoose";
import { publishToQueue } from "../../../queues/publisher";
import { RabbitMQConfig } from "../../../config/rabbitMQ";

export class EmployeeController implements IEmployeeController {
    private readonly employeeService : IEmployeeService;

    constructor(EmployeeService : IEmployeeService){
        this.employeeService = EmployeeService;
    }



    public createEmployee = async(req: Request, res: Response): Promise<void> => {
        try {
            
            const authUserUUID = req.query.authUserUUID as string;
            if(!authUserUUID) {
                res.status(401).json({message: "unauthorised",success:false}); 
                return
              }

            const {name, email , phone, departmentName,departmentId,companyId} = req.body;
            if(!name || ! email || ! phone || ! departmentName|| !departmentId|| !companyId ){
                res.status(401).json({message:"provide all neccessory fields" , success:false});
                return;
            }

            const employeeData  = new EmployeeModel ({
                name,
                email,
                phone,
                departmentName,
                departmentId : new mongoose.Types.ObjectId(departmentId as string),
                companyId :  new mongoose.Types.ObjectId(companyId as string),
                authUserUUID
                
            });
            
            const saveEmployeeData = await this.employeeService.addEmployees(employeeData);
            if(!saveEmployeeData){
                res.status(400).json({message:"failed to save user data",success:false});
                return
            }

            const {message , success , authData} = saveEmployeeData;
            //sending data to company service
            await publishToQueue(RabbitMQConfig.authConsumerQueue,authData as object);

            res.status(201).json({message,success});
            return;

        } catch (error) {
            res.status(400).json({message:String(error),success:false})
        }
    }

    public getEmployeeData = async(req: Request, res: Response): Promise<void> => {
        try {

            const email = req.query.email;
            if(!email){
                res.status(401).json({message:"email id not found",success:false})
                return;
            }
            const userData = await this.employeeService.fetchEmployeeData(email as string);
            const {success,message,data} = userData;
            const statusCode = success ? 200 : 400;
            res.status(statusCode).json({message,success,data});
            return;
            
        } catch (error) {
            res.status(400).json({message:String(error),success:false});
            return;
        }
    }

    public updateEmployee = async(req: Request, res: Response): Promise<void> =>{

        try {

            if(!req.body){
                res.status(401).json({message:"provide neccessory data",success:false})
                return;
            }

            const { email, ...updateData } = req.body; 

            const updatedData = await this.employeeService.updateEmployeeProfile(email,updateData);
            const {success,message,data} = updatedData;
            const statusCode = success ? 200 : 400;
            res.status(statusCode).json({message,success,data});
            return;

            
        } catch (error) {
            res.status(400).json({message:String(error),success:false});
            return;
        }
        
    }
}