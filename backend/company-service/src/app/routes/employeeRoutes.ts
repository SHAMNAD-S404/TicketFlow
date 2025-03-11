import { Router } from "express";
import { EmployeeController } from "../controllers/implementaion/employeeController";
import { extractUserData } from "../middlewares/extractUserData";
import EmployeeService from "../services/implements/employeeService";
import multer from "multer";
import { storage } from "../../storage/storage";
import { fileFilter } from "../middlewares/multerValidation";

const employeeService = new EmployeeService();
const employeeController = new EmployeeController(employeeService);

const upload = multer({
      storage,
      fileFilter,
      limits : {fileSize : 3* 1024 * 1024},
      });


const router = Router();

router.post("/add-employee",extractUserData,employeeController.createEmployee)
      .get("/get-user",extractUserData,employeeController.getEmployeeData)
      .patch("/update-profile",employeeController.updateEmployee)
      .get("/get-all-employees",extractUserData,employeeController.getAllEmployees)
      .get("/get-department-employee",extractUserData,employeeController.getDepartmentWiseEmployees)
      .post("/upload-dp",extractUserData,upload.single('file'),employeeController.uploadProfileImage)
      .get("/get-employee-by-department",extractUserData,employeeController.getEmployeesByDept)
      .get("/get-employee-by-less-ticket",extractUserData,employeeController.fetchEmployeeWithlessTicket)


export default router;