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

//new codes
export class DepartmentController implements IDepartmentController {
  private readonly departmentService: IDepartmentService;
  private readonly companyService: ICompanyService;

  constructor(DepartmentService: IDepartmentService, CompanyService: ICompanyService) {
    this.departmentService = DepartmentService;
    this.companyService = CompanyService;
  }

  public createDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const authUserUUID = req.query.authUserUUID as string;
      const { departmentName, responsibilities } = req.body;

      if (!authUserUUID || !departmentName || !responsibilities) {
        res.status(400).json({
          message: "provide all neccessary data",
          success: false,
        });
        return;
      }

      const company = await this.companyService.getCompanyIdWithAuthUserUUID(authUserUUID);
      if (!company) {
        res.status(401).json({
          message: "Company not found",
          success: false,
        });
        return;
      }
      const companyId = new mongoose.Types.ObjectId(company);

      const departmentData = {
        companyId,
        departmentName,
        departmentNameNormalized: normalizeDepartmentName(departmentName),
        responsibilities,
        authUserUUID,
      };

      const response = await this.departmentService.createDepartment(departmentData);
      const { message, success } = response;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({
        message,
        success,
      });
      return;
    } catch (error) {
      res.status(400).json({
        message: String(error),
        success: false,
      });
    }
  };

  public getAllDepartmentList = async (req: Request, res: Response): Promise<void> => {
    try {
      const authUserUUID = req.query.authUserUUID as string;
      if (!authUserUUID) {
        res.status(401).json({ message: "unauthorised", success: false });
        return;
      }
      const company = await this.companyService.getCompanyIdWithAuthUserUUID(authUserUUID);
      if (!company) {
        res.status(401).json({ message: Messages.DATA_NOT_FOUND, success: false });
      }
      const departmentList = await this.departmentService.getAllDepartmentNameList(company);

      const { success, message, data } = departmentList;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({ success, message, data });
      return;
    } catch (error) {
      res.status(400).json({
        message: String(error),
        success: false,
      });
    }
  };

  public getAllDepartmentData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { authUserUUID } = req.query;
      const validateAuthUserUUID = authUserUUIDSchema.safeParse(authUserUUID);
      if (!validateAuthUserUUID.success) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const getData = await this.departmentService.getAllDepartmentData(validateAuthUserUUID.data);
      const { message, statusCode, success, data } = getData;

      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      console.error("error in getAllDeaprtmentData : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ messsage: Messages.SERVER_ERROR, success: false });
    }
  };

  public updateDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, authUserUUID } = req.query;
      if (role !== "company") {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.NO_ACCESS,
          success: false,
        });
      }
      const { id, departmentName, responsibilities } = req.body;

      const validateData = departmentUpdateSchema.safeParse({ id, departmentName, responsibilities });
      const validateUUID = authUserUUIDSchema.safeParse(authUserUUID);
      if (!validateData.success || !validateUUID.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }

      const result = await this.departmentService.getUpdatedDepartmentData(
        validateData.data.id,
        validateData.data.departmentName,
        validateData.data.responsibilities,
        validateUUID.data
      );

      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({
        success,
        message,
        data,
      });
      return;
    } catch (error) {
      console.error("error while update departemte : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ messages: Messages.SERVER_ERROR, success: false });
    }
  };

  public deleteDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, role } = req.query;
      if (role !== Roles.Company) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INPUT_INVALID_OR_FIELD_MISSING, success: false });
        return;
      }

      const result = await this.departmentService.deleteDepartementService(id as string);
      const { message, statusCode, success } = result;
      res.status(statusCode).json({ message, success });
    } catch (error) {
      console.error("error while delete department", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };
}
