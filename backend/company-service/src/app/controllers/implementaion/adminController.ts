import { Request ,Response } from "express";
import { IAdminController } from "../interface/IAdminController";
import { ICompanyService } from "../../services/interface/ICompanyService";

 export class AdminController implements IAdminController {
    private readonly comapanyService : ICompanyService ;

    constructor(CompanyService : ICompanyService) {
        this.comapanyService = CompanyService;
    }

    public getUserData = async(req: Request, res: Response): Promise<void> =>{
        try {
            const userId = req.query.userId;
            if(!userId){
                res.status(400).json({message:"user id dont found",succeess:false})
                return;
            }

            const response = await this.comapanyService.fetchCompanyData(userId.toString());
            const {message, success,data} = response;
            console.log("hi im inside the compnay service , response :", response)
            const statusCode = success ? 200:400;

            res.status(statusCode).json({message,success,data});
            return;
            
        } catch (error) {
            res.status(400).json({message:String(error),success:false})
        }
    }



}

