import { Router } from "express";
import { AdminController } from "../controllers/implementaion/adminController";


const adminController = new AdminController();


const router = Router();

router.get("/get-user")


export default router;