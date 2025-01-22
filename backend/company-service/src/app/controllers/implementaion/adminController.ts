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

            
            
        } catch (error) {
            
        }
    }



}

