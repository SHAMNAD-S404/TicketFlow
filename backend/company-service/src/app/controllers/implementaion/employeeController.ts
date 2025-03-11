import { IEmployeeController } from "../interface/IEmployeeController";
import { Request, Response } from "express";
import { IEmployeeService } from "../../services/interface/IEmployeeService";
import EmployeeModel from "../../models/implements/employee";
import mongoose from "mongoose";
import { publishToQueue } from "../../../queues/publisher";
import { RabbitMQConfig } from "../../../config/rabbitMQ";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { departmentEmployeeSchema, searchInputSchema } from "../../dtos/searchInput.dto";
import { emailSchema } from "../../dtos/jwtQueryValidation";
import { fetchDeptEmployeesSchema } from "../../dtos/BaseValidation.schema";
export class EmployeeController implements IEmployeeController {
  private readonly employeeService: IEmployeeService;

  constructor(EmployeeService: IEmployeeService) {
    this.employeeService = EmployeeService;
  }

  public createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const authUserUUID = req.query.authUserUUID as string;
      if (!authUserUUID) {
        res.status(401).json({ message: "unauthorised", success: false });
        return;
      }

      const { name, email, phone, departmentName, departmentId, companyId } = req.body;
      if (!name || !email || !phone || !departmentName || !departmentId || !companyId) {
        res.status(401).json({ message: "provide all neccessory fields", success: false });
        return;
      }

      const employeeData = new EmployeeModel({
        name,
        email,
        phone,
        departmentName,
        departmentId: new mongoose.Types.ObjectId(departmentId as string),
        companyId: new mongoose.Types.ObjectId(companyId as string),
        authUserUUID,
      });

      const saveEmployeeData = await this.employeeService.addEmployees(employeeData);
      if (!saveEmployeeData) {
        res.status(400).json({ message: "failed to save user data", success: false });
        return;
      }

      const { message, success, authData } = saveEmployeeData;
      //sending data to company service
      await publishToQueue(RabbitMQConfig.authConsumerQueue, authData as object);

      res.status(201).json({ message, success });
      return;
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  public getEmployeeData = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.query.email;
      if (!email) {
        res.status(401).json({ message: "email id not found", success: false });
        return;
      }
      const userData = await this.employeeService.fetchEmployeeData(email as string);
      const { success, message, data } = userData;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
      return;
    }
  };

  public updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body) {
        res.status(401).json({ message: "provide neccessory data", success: false });
        return;
      }
      const { email, ...updateData } = req.body;
      const updatedData = await this.employeeService.updateEmployeeProfile(email, updateData);
      const { success, message, data } = updatedData;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
      return;
    }
  };

  public getAllEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, page, sortBy, searchKey, companyId } = req.query;

      const validateSearchKey = searchInputSchema.safeParse(req.query);

      if (!validateSearchKey.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }

      if (role !== "company") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }
      const response = await this.employeeService.fetchAllEmployees(
        String(companyId),
        Number(page),
        String(sortBy),
        String(searchKey)
      );
      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ messages: Messages.SERVER_ERROR, status: false });
    }
  };

  public getDepartmentWiseEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateInput = departmentEmployeeSchema.safeParse(req.query);
      if (!validateInput.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }
      if (validateInput.data?.role !== "company") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const { companyId, departmentId, currentPage, searchKey, sortBy } = validateInput.data;

      const response = await this.employeeService.fetchDeptEmployees(
        companyId,
        departmentId,
        currentPage,
        sortBy,
        searchKey
      );
      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      console.error("error while fetching getDepartmentWiseEmployees:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  public uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: Messages.FAIL_TRY_AGAIN });
        return;
      }

      const email = emailSchema.safeParse(req.query.email);
      if (!email.success) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.EMAIL_INVALID,
          success: false,
        });
        return;
      }
      const emailId = String(req.query.email);

      const updateData = await this.employeeService.updateProfileImage(emailId, req.file.path);
      const { message, statusCode, success, imageUrl } = updateData;
      console.log("im return url", imageUrl);
      res.status(statusCode).json({
        message,
        success,
        imageUrl,
      });
      console.log(req.file.path);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

  public getEmployeesByDept = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, authUserUUID } = req.query;
      if (!id || !authUserUUID) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.REQUIRED_FIELD_MISSING,
          success: false,
        });
        return;
      }

      const result = await this.employeeService.getEmployeesDeptWise(String(id), String(authUserUUID));
      const { message, statusCode, success, data } = result;

      res.status(statusCode).json({
        message,
        success,
        statusCode,
        data,
      });
    } catch (error) {
      console.log("error while getEmployeesByDept : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.SERVER_ERROR,
        success: false,
      });
    }
  };

  public fetchEmployeeWithlessTicket = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateInput = fetchDeptEmployeesSchema.safeParse(req.query);
      if (!validateInput.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INPUT_INVALID_OR_FIELD_MISSING,
          success: false,
        });
        return;
      }
      const { authUserUUID, id } = validateInput.data;

      const result = await this.employeeService.getEmployeeWithlessTicket(id, authUserUUID);
      const { message, statusCode, success, data } = result;
      res.status(statusCode).json({ message, success, data });
      return;
    } catch (error) {
      console.log("error while fetchEmployeeWithlessTicket : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };
}
