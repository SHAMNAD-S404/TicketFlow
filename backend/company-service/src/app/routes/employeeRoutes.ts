import { Router } from "express";
import { EmployeeController } from "../controllers/implementaion/employeeController";
import { extractUserData } from "../middlewares/extractUserData";
import EmployeeService from "../services/implements/employeeService";


const employeeService = new EmployeeService();
const employeeController = new EmployeeController(employeeService);


const router = Router();

router.post("/add-employee",extractUserData,employeeController.createEmployee)
      .get("/get-user",extractUserData,employeeController.getEmployeeData)
      .patch("/update-profile",employeeController.updateEmployee)
      .get("/get-all-employees",extractUserData,employeeController.getAllEmployees)


export default router;