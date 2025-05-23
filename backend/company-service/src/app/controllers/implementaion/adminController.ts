import { Request, Response } from "express";
import { IAdminController } from "../interface/IAdminController";
import { ICompanyService } from "../../services/interface/ICompanyService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { emailSchema } from "../../dtos/jwtQueryValidation";
import Roles from "../../../constants/roles";




/**
 * @class AdminController
 * @description Handles administrative-related requests, orchestrating interactions
 * between the client and the company service layer for administrative tasks.
 * @implements {IAdminController}
 */


export class AdminController implements IAdminController {

    /**
   * @type {ICompanyService}
   * @description Instance of the company service, responsible for business logic pertaining to company administration.
   */

  private readonly comapanyService: ICompanyService;

    /**
   * @constructor
   * @param {ICompanyService} CompanyService - The dependency for the company service.
   */

  constructor(CompanyService: ICompanyService) {
    this.comapanyService = CompanyService;
  }

//========================= GET USER DATA ==============================================================

  public getUserData = async (req: Request, res: Response): Promise<void> => {
    try {

      const { email, role } = req.query;
      // Authorization checking only company have the right for this action
      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.NO_ACCESS,
          success: false,
        });
        return;
      }

      if (!email) {
        res.status(400).json({ message: Messages.EMAIL_MISSING, succeess: false });
        return;
      }

      // Delegating to the service layer for get comapny data
      const response = await this.comapanyService.fetchCompanyData(email.toString());
      const { message, success, data,statusCode } = response;
      res.status(statusCode).json({ message, success, data });
      return;

    } catch (error) {

       console.log("error while getUserData :" ,error);
       res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message:Messages.SERVER_ERROR,success:false})
    }
  };

//========================= UPDATE  COMPANY DATA ============================================================

  public updateCompany = async (req: Request, res: Response): Promise<void> => {
    try {

      if (!req.body) {
        res.status(HttpStatus.BAD_REQUEST)
        .json({ message: Messages.ALL_FILED_REQUIRED_ERR, success: false });
        return;
      }

      const { email, ...updateData } = req.body;
      // Delegating to the company service layer for updating the comapany document
      const updatedCompany = await this.comapanyService.getCompanyUpdateProfile(email, updateData);
      const { success, message, data ,statusCode} = updatedCompany;

      res.status(statusCode).json({ message, success, data });
    } catch (error) {

      console.log("error while update company :" ,error);
       res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message:Messages.SERVER_ERROR,success:false})
    }
  };

//========================= FETCH ALL COMPANY DATA ===========================================================

  public fetchAllCompany = async (req: Request, res: Response): Promise<void> => {
    try {

      // Authorization , super admin only allowed for this action
      if (req.query.role !== Roles.Admin) {
        res.status(HttpStatus.UNAUTHORIZED)
        .json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const { page = "1", sort = "createdAt", searchKey } = req.query;
      // Delegating to the company service  to get all company
      const response = await this.comapanyService.getAllCompany(
        Number(page),
        sort as string,
        String(searchKey)
      );
      const { message, successs, data,statusCode } = response;
      res.status(statusCode).json({ message, successs, data });

    } catch (error) {

      console.log("error in fetch all comapny : ",error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: String(error), success: false });
    }
  };

//========================= UPDATE PROFILE IMAGE ==============================================================

  public uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {

      if (!req.file) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: Messages.FAIL_TRY_AGAIN });
        return;
      }

      // Input validation using zod schema
      const email = emailSchema.safeParse(req.query.email);
      if (!email.success) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.EMAIL_INVALID,
          success: false,
        });
        return;
      }
      // user email
      const emailId = String(req.query.email);
      // delegating to the service layer for update profile image
      const updateData = await this.comapanyService.updateProfileImage(emailId, req.file.path);

      const { message, statusCode, success, imageUrl } = updateData;
      res.status(statusCode).json({
        message,
        success,
        imageUrl,
      });

    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

//========================= FETCH SUBSRIBTION STATUS =======================================================

  public fetchSubsStats = async (req: Request, res: Response): Promise<void> => {
    try {

      const { role } = req.query;
      // only super admin have permission to do this action
      if (role !== Roles.Admin) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      // Delegating to the company service 
      const response = await this.comapanyService.getSubsStaticService();
      const { data, message, statusCode, success } = response;
      res.status(statusCode).json({ message, data, success });

    } catch (error) {
      console.log(`${Messages.ERROR_WHILE} fetch company subs statics : `, error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= ***************************** =================================================

}
