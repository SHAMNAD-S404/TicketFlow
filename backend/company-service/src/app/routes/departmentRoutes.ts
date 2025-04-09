import { Router  } from "express";
import { DepartmentController } from "../controllers/implementaion/departmentController";
import { extractUserData } from "../middlewares/extractUserData";
import DepartmentService from "../services/implements/departmentService";
import CompanyService from "../services/implements/companyService";
import { IDepartmentController } from "../controllers/interface/IDepartmentController";
import { ICompanyService } from "../services/interface/ICompanyService";
import { IDepartmentService } from "../services/interface/IDepartmentService";

const departementServices : IDepartmentService = new DepartmentService();
const companyService : ICompanyService = new CompanyService();
const departmentController : IDepartmentController = new DepartmentController(departementServices, companyService);

//route setup
const router = Router();


router.post  ("/add-department",extractUserData,departmentController.createDepartment)
      .get   ("/get-departments",extractUserData,departmentController.getAllDepartmentList)
      .get   ("/get-departments-data",extractUserData,departmentController.getAllDepartmentData)
      .patch ("/update-department",extractUserData,departmentController.updateDepartment)
      .delete("/delete-department",extractUserData,departmentController.deleteDepartment)
     


export default router;