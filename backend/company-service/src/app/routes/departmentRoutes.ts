import { Router ,Request,Response,NextFunction } from "express";
import { DepartmentController } from "../controllers/implementaion/departmentController";
import { extractUserData } from "../middlewares/extractUserData";
import DepartmentService from "../services/implements/departmentService";
import CompanyService from "../services/implements/companyService";


const departementServices = new DepartmentService();
const companyService = new CompanyService();
const departmentController = new DepartmentController(departementServices, companyService);

const router = Router();


router.post("/add-department",extractUserData,departmentController.createDepartment);


export default router;