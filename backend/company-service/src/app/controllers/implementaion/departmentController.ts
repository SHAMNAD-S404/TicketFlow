import { Request, Response } from "express";
import { IDepartmentController } from "../interface/IDepartmentController";
import { IDepartmentService } from "../../services/interface/IDepartmentService";
import { ICompanyService } from "../../services/interface/ICompanyService";
import mongoose from "mongoose";
import { normalizeDepartmentName } from "../../../utils/normalizeName";
import { Messages } from "../../../constants/messageConstants";
import { authUserUUIDSchema } from "../../dtos/jwtQueryValidation";
import { HttpStatus } from "../../../constants/httpStatus";
import { departmentUpdateSchema } from "../../dtos/departmentUpdate.dto";
import Roles from "../../../constants/roles";

/**
 * @class DepartmentController
 * @description Handles incoming requests related to departments, orchestrating the flow
 * of data between the client, the department service, and the company service.
 * @implements {IDepartmentController}
 */

export class DepartmentController implements IDepartmentController {
  /**
   * @type {IDepartmentService}
   * @description Instance of the department service, responsible for department-specific business logic.
   *
   * @type {ICompanyService}
   * @description Instance of the company service, used for company-related operations if required by department logic.
   */

  private readonly departmentService: IDepartmentService;
  private readonly companyService: ICompanyService;

  /**
   * @constructor
   * @param {IDepartmentService} DepartmentService - The dependency for the department service.
   * @param {ICompanyService} CompanyService - The dependency for the company service.
   */

  constructor(DepartmentService: IDepartmentService, CompanyService: ICompanyService) {
    this.departmentService = DepartmentService;
    this.companyService = CompanyService;
  }


//========================= CREATE DEPARTMENT ==============================================

  public createDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const authUserUUID = req.query.authUserUUID as string;
      const { departmentName, responsibilities } = req.body;

      if (!authUserUUID || !departmentName || !responsibilities) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.ALL_FILED_REQUIRED_ERR,
          success: false,
        });
        return;
      }

      // getting company id form the service layer
      const company = await this.companyService.getCompanyIdWithAuthUserUUID(authUserUUID);
      if (!company) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: Messages.USER_NOT_FOUND,
          success: false,
        });
        return;
      }
      // converting to mongodb object Id
      const companyId = new mongoose.Types.ObjectId(company);

      // payload for storing data in db.
      const departmentData = {
        companyId,
        departmentName,
        departmentNameNormalized: normalizeDepartmentName(departmentName),
        responsibilities,
        authUserUUID,
      };

      // Delegating to the service layer for create document
      const response = await this.departmentService.createDepartment(departmentData);
      const { message, success,statusCode } = response;
      res.status(statusCode).json({message,success});
    } catch (error) {

      console.log("error while create department :" ,error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

//========================= GET ALL DEPARTMENT LIST ===================================================

  public getAllDepartmentList = async (req: Request, res: Response): Promise<void> => {

    try {
      
      const authUserUUID = req.query.authUserUUID as string;

      if (!authUserUUID) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
        message: Messages.ALL_FILED_REQUIRED_ERR,
        success: false});
        return;
      }

      // delegating to the company service to get the company data
      const company = await this.companyService.getCompanyIdWithAuthUserUUID(authUserUUID);

      if (!company) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          message: Messages.DATA_NOT_FOUND,
          success: false });
          return;
      }
      // Get all department list in a company
      const departmentList = await this.departmentService.getAllDepartmentNameList(company);
      const { success, message, data,statusCode } = departmentList;
      res.status(statusCode).json({ success, message, data });

    } catch (error) {

      console.log("error while get all department :" ,error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

//========================= GET ALL DEPARTMENT DATA =====================================================

  public getAllDepartmentData = async (req: Request, res: Response): Promise<void> => {
    try {

      const { authUserUUID } = req.query;
      // input validaton using zod
      const validateAuthUserUUID = authUserUUIDSchema.safeParse(authUserUUID);
      if (!validateAuthUserUUID.success) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      // Delegating to get service layer for getting all department data
      const getData = await this.departmentService.getAllDepartmentData(validateAuthUserUUID.data);
      const { message, statusCode, success, data } = getData;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {
      console.error("error in getAllDeaprtmentData : ", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ messsage: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= UPDATE DEAPRTMENT ============================================================

  public updateDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, authUserUUID } = req.query;
      // only company admin have the right for this action
      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.NO_ACCESS,
          success: false,
        });
        return;
      }

      const { id, departmentName, responsibilities } = req.body;
      
      //validating input using zod schema
      const validateData = departmentUpdateSchema.safeParse({
        id,
        departmentName,
        responsibilities,
      });
      //validating input using zod schema
      const validateUUID = authUserUUIDSchema.safeParse(authUserUUID);

      if (!validateData.success || !validateUUID.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }

      // Delegating to the service layer for get updated document.
      const result = await this.departmentService.getUpdatedDepartmentData(
        validateData.data.id,
        validateData.data.departmentName,
        validateData.data.responsibilities,
        validateUUID.data
      );

      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({success,message,data});
  
    } catch (error) {

      console.error("error while update departemte : ", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ messages: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= DELETE DEPARTMENT =======================================================

  public deleteDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, role } = req.query;
      // only companhy admin have the previlage to delete the department
      if (role !== Roles.Company) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      if (!id) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INPUT_INVALID_OR_FIELD_MISSING, success: false });
        return;
      }

      // delegating to the service layer for delete department
      const result = await this.departmentService.deleteDepartementService(id as string);
      const { message, statusCode, success } = result;
      res.status(statusCode).json({ message, success });
    } catch (error) {
      
      console.error("error while delete department", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= ************************** ==================================================
}
