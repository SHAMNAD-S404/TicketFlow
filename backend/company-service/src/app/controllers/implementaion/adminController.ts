import { Request ,Response } from "express";
import { IAdminController } from "../interface/IAdminController";
import { ICompanyService } from "../../services/interface/ICompanyService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";

 export class AdminController implements IAdminController {
    private readonly comapanyService : ICompanyService ;

    constructor(CompanyService : ICompanyService) {
        this.comapanyService = CompanyService;
    }

    public getUserData = async(req: Request, res: Response): Promise<void> =>{
        try {
            const email = req.query.email;
            if(!email){
                res.status(400).json({message:"user id dont found",succeess:false})
                return;
            }

            const response = await this.comapanyService.fetchCompanyData(email.toString());
            const {message, success,data} = response;
            const statusCode = success ? 200:400;

            res.status(statusCode).json({message,success,data});
            return;
            
        } catch (error) {
            res.status(400).json({message:String(error),success:false})
        }
    }

    public updateCompany = async(req: Request, res: Response): Promise<void> => {
        try {

            if(!req.body){
                res.status(401).json({message:"provide neccessory data",success:false})
                return;
            }

            const { email, ...updateData } = req.body; 
            const updatedCompany = await this.comapanyService.getCompanyUpdateProfile(email,updateData)
            const {success,message,data} = updatedCompany;
            const statusCode = success ? 200 : 400;
            res.status(statusCode).json({message,success,data});
            return;
        } catch (error) {
            res.status(400).json({message:String(error),success:false});
            return;
        }
    }

    public fetchAllCompany = async(req: Request, res: Response): Promise<void> => {
        try {

            if(req.query.role !== "sudo"){
                res.status(HttpStatus.UNAUTHORIZED).json({message:Messages.NO_ACCESS,success:false});
                return;
            }

            const {page = '1',sort="createdAt" , searchKey} = req.query;

            const response = await this.comapanyService.getAllCompany(Number(page),sort as string ,String(searchKey));
            const {message,successs,data} = response;
            res.status(response.statusCode).json({message,successs,data});
            return;

            
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:String(error),success:false})
        }
    }

 



}

