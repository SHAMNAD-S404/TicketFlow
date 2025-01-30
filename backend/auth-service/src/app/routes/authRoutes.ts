import {  Router  } from "express";
import { AuthController } from "../controllers/implementations/AuthController";
import { AuthService } from "../services/implementations/authService";
import { UserRepository } from "../repositories/implements/userRepository";
import { authenticateToken } from "../middlewares/authenticateToken";
import { extractUserData } from "../middlewares/extractUserData";


const router = Router();

// Dependency setup
const userRepository = new UserRepository(); 
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);


//Route
router.post("/signup",authController.registerUser)
      .post("/verify-otp",authController.verifyOTP)
      .post("/login",authController.verifyLogin)
      .post("/verify-email",authController.verifyEmail)
      .patch("/reset-password",authenticateToken,authController.updateUserPassword)
      .get("/get-user-role",authenticateToken,extractUserData,authController.fetchUserRole)


export default router;