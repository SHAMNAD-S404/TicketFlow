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
import { changeDepartmentSchema, fetchDeptEmployeesSchema } from "../../dtos/BaseValidation.schema";
import Roles from "../../../constants/roles";


/**
 * @class EmployeeController
 * @description Handles incoming requests related to employees, orchestrating the flow
 * of data between the client and the employee service layer.
 * @implements {IEmployeeController}
 */


export class EmployeeController implements IEmployeeController {

   /**
   * @type {IEmployeeService}
   * @description Instance of the employee service, responsible for employee-specific business logic.
   */

  private readonly employeeService: IEmployeeService;

  /**
   * @constructor
   * @param {IEmployeeService} EmployeeService - The dependency for the employee service.
   */

  constructor(EmployeeService: IEmployeeService) {
    this.employeeService = EmployeeService;
  }


//========================= CREATE EMPLOYEE =============================================

  public createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {

      const authUserUUID = req.query.authUserUUID as string;
      if (!authUserUUID) {
        res.status(401).json({ message: "unauthorised", success: false });
        return;
      }

      const { name, email, phone, departmentName, departmentId, companyId } = req.body;
      
      if (!name || !email || !phone || !departmentName || !departmentId || !companyId) {
        res.status(HttpStatus.BAD_REQUEST)
        .json({ message: Messages.ALL_FILED_REQUIRED_ERR, success: false });
        return;
      }

      //creating new employee modal for storing data
      const employeeData = new EmployeeModel({
        name,
        email,
        phone,
        departmentName,
        departmentId: new mongoose.Types.ObjectId(departmentId as string),
        companyId: new mongoose.Types.ObjectId(companyId as string),
        authUserUUID,
      });

      // delegating to the service layer for storing the user data
      const saveEmployeeData = await this.employeeService.addEmployees(employeeData);

      if (!saveEmployeeData) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          message: Messages.FAIL_TRY_AGAIN,
          success: false});
        return;
      }

      const { message, success, authData,statusCode } = saveEmployeeData;

      //payload data to send to auth consumer
      const authservicePayload = {
        eventType: "create-user-employee",
        userData: authData,
      };

      //sending data to company service
      await publishToQueue(RabbitMQConfig.authConsumerQueue, authservicePayload);

      res.status(statusCode).json({ message, success });
    
    } catch (error) {

      console.error("error while add employee : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({ messages: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET EMPLOYEES DATA  =============================================

  public getEmployeeData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, role } = req.query;
      // authorization controll
      if (role !== Roles.Employee) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.NO_ACCESS,
          success: false,
        });
        return;
      }

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).
        json({ message: Messages.EMAIL_MISSING, success: false });
        return;
      }
      
      // delegating to the service layer for fetch employee documet
      const userData = await this.employeeService.fetchEmployeeData(email as string);
      const { success, message, data,statusCode } = userData;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while get employee data : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({ messages: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= UPDATE EMPLOYEE DATA =============================================

  public updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body) {
        res.status(HttpStatus.BAD_REQUEST)
        .json({ message: Messages.ALL_FILED_REQUIRED_ERR, success: false });
        return;
      }

      const { email, ...updateData } = req.body;
      // Deligating to the service layer for update employee profile
      const updatedData = await this.employeeService.updateEmployeeProfile(email, updateData);
      const { success, message, data,statusCode } = updatedData;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while update employe : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({ messages: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET ALL EMPLOYEES ============================================================

  public getAllEmployees = async (req: Request, res: Response): Promise<void> => {

    try {

      const { role, page, sortBy, searchKey, companyId } = req.query;
      // input validation using zod schema
      const validateSearchKey = searchInputSchema.safeParse(req.query);
      if (!validateSearchKey.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }

      //Only company admin have the right for this action
      if (role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED)
        .json({ message: Messages.NO_ACCESS, success: false });
        return;
      }
      
      //fetch all employees
      const response = await this.employeeService.fetchAllEmployees(
        String(companyId),
        Number(page),
        String(sortBy),
        String(searchKey)
      );

      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while get all employees : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({ messages: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= GET DEPARTMENT WISE EMPLOYEES =============================================

  public getDepartmentWiseEmployees = async (req: Request, res: Response): Promise<void> => {

    try {
      // input validation using zod schema
      const validateInput = departmentEmployeeSchema.safeParse(req.query);
      if (!validateInput.success) {
        res.status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ENTER_VALID_INPUT, success: false });
        return;
      }

       //Only company admin have the right for this action
      if (validateInput.data?.role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED)
        .json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const { companyId, departmentId, currentPage, searchKey, sortBy } = validateInput.data;

      // fetch employees department wise
      const response = await this.employeeService.fetchDeptEmployees(
        companyId,
        departmentId,
        currentPage,
        sortBy,
        searchKey
      );

      const { message, statusCode, success, data } = response;
      res.status(statusCode).json({ message, success, data });

    } catch (error) {

      console.error("error while fetching getDepartmentWiseEmployees:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= UPLOAD PROFILE IMAGE =============================================

  public uploadProfileImage = async (req: Request, res: Response): Promise<void> => {

    try {
      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: Messages.FAIL_TRY_AGAIN });
        return;
      }

      //email validation
      const email = emailSchema.safeParse(req.query.email);
      if (!email.success) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.EMAIL_INVALID,
          success: false,
        });
        return;
      }

      const emailId = String(req.query.email);

      //delegation to the service layer for upload profile image
      const updateData = await this.employeeService.updateProfileImage(emailId, req.file.path);
      const { message, statusCode, success, imageUrl } = updateData;

      res.status(statusCode).json({
        message,
        success,
        imageUrl,
      });
    } catch (error) {

      console.log("error while uploadprofileImage : ",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: Messages.SERVER_ERROR });
    }
  };

//========================= GET EMPLOYEE BY DEPARTMENT WISE =============================================

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

      const result = await this.employeeService.getEmployeesDeptWise(
        String(id),
        String(authUserUUID)
      );

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

//========================= GET EMPLOYEE WITH LESS TICKET =============================================

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

    } catch (error) {

      console.log("error while fetchEmployeeWithlessTicket : ", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= CHANGE EMPLOYEE DEPARTMENT =============================================

  public changeDepartment = async (req: Request, res: Response): Promise<void> => {
    try {

      if (req.query.role !== Roles.Company) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const validateData = changeDepartmentSchema.safeParse(req.body);
      if (!validateData.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ messages: Messages.INPUT_INVALID_OR_FIELD_MISSING, success: false });
        return;
      }

      const updateEmployee = await this.employeeService.changeDepartmentService(req.body);
      const { message, statusCode, success } = updateEmployee;
      res.status(statusCode).json({ message, success });
      
    } catch (error) {
      console.error("error while change department", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//========================= ***************************************************** ============================================= 
}
