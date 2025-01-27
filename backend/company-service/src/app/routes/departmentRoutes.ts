import { Router ,Request,Response,NextFunction } from "express";
import { DepartmentController } from "../controllers/implementaion/departmentController";
import { extractUserData } from "../middlewares/extractUserData";
import DepartmentService from "../services/implements/departmentService";


const departementServices = new DepartmentService();
const departmentController = new DepartmentController(departementServices);

const router = Router();




router.post("/add-department",extractUserData,departmentController.createDepartment);


export default router;