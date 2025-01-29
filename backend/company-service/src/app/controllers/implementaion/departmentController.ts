import { Request, Response } from "express";
import { IDepartmentController } from "../interface/IDepartmentController";
import { IDepartmentService } from "../../services/interface/IDepartmentService";
import { ICompanyService } from "../../services/interface/ICompanyService";
import mongoose from "mongoose";

//new codes
export class DepartmentController implements IDepartmentController {
  private readonly departmentService: IDepartmentService;
  private readonly companyService: ICompanyService;

  constructor(
    DepartmentService: IDepartmentService,
    CompanyService: ICompanyService
  ) {
    this.departmentService = DepartmentService;
    this.companyService = CompanyService;
  }


  public createDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const authUserUUID = req.query.authUserUUID as string;
      const { departmentName, responsibilities } = req.body;

      if (!authUserUUID || !departmentName || !responsibilities) {
        res
          .status(400)
          .json({ message: "provide all neccessary dat", success: false });
        return;
      }

      const company = await this.companyService.getCompanyIdWithAuthUserUUID(
        authUserUUID
      );
      if (!company) {
        res.status(401).json({ message: "Company not found", success: false });
        return;
      }
      const companyId = new mongoose.Types.ObjectId(company);

      const departmentData = {
        companyId,
        departmentName,
        responsibilities,
        authUserUUID,
      };

      const response = await this.departmentService.createDepartment(
        departmentData
      );
      const { message, success } = response;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({ message, success });
      return;
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  public getAllDepartmentList  = async (req : Request, res: Response) : Promise<void> => {
    try {

      const authUserUUID = req.query.authUserUUID as string;
      if(!authUserUUID) {
        res.status(401).json({message: "unauthorised",success:false});
        return
      }

      const company = await this.companyService.getCompanyIdWithAuthUserUUID(authUserUUID);
      if(!company){
        res.status(401).json({message:"unauthorised! company not found",success:false})
      }

      const departmentList = await this.departmentService.getAllDepartmentNameList(company)

      const {success,message , data} = departmentList;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({success,message,data})
      return;
      
    } catch (error) {
      res.status(400).json({message : String(error) , success:false})
    }
  }


}
