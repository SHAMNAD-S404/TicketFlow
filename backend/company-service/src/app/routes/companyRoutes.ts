import { Router } from "express";
import { AdminController } from "../controllers/implementaion/adminController";
import { extractUserData } from "../middlewares/extractUserData";
import CompanyService from "../services/implements/companyService";
import multer from "multer";
import {storage} from '../../storage/storage'
import {fileFilter } from "../middlewares/multerValidation"



const companyService = new CompanyService()
const adminController = new AdminController(companyService);

const upload = multer({
      storage,
      fileFilter,
      limits : {fileSize : 3* 1024 * 1024},
      });

const router = Router();

router.get("/get-user",extractUserData,adminController.getUserData)
      .patch("/update-profile",adminController.updateCompany)
      .get("/get-all-companies",extractUserData,adminController.fetchAllCompany)
      .post("/upload-dp",extractUserData,upload.single('file'),adminController.uploadProfileImage)
      .get ("/get-company-subs-statics",extractUserData,adminController.fetchSubsStats)
     


export default router;