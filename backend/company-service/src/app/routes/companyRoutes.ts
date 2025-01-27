import { Router } from "express";
import { AdminController } from "../controllers/implementaion/adminController";
import { extractUserData } from "../middlewares/extractUserData";
import CompanyService from "../services/implements/companyService";


const companyService = new CompanyService()
const adminController = new AdminController(companyService);


const router = Router();

router.get("/get-user",extractUserData,adminController.getUserData)
     


export default router;