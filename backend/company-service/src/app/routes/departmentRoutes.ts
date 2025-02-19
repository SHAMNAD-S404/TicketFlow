import { Router  } from "express";
import { DepartmentController } from "../controllers/implementaion/departmentController";
import { extractUserData } from "../middlewares/extractUserData";
import DepartmentService from "../services/implements/departmentService";
import CompanyService from "../services/implements/companyService";

const departementServices = new DepartmentService();
const companyService = new CompanyService();
const departmentController = new DepartmentController(departementServices, companyService);

//route setup
const router = Router();


router.post  ("/add-department",extractUserData,departmentController.createDepartment)
      .get   ("/get-departments",extractUserData,departmentController.getAllDepartmentList)
      .get   ("/get-departments-data",extractUserData,departmentController.getAllDepartmentData)
      .patch ("/update-department",extractUserData,departmentController.updateDepartment)


export default router;