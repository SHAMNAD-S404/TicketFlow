import {  Router  } from "express";
import { AuthController } from "../controllers/implementations/AuthController";
import { AuthService } from "../services/implementations/authService";
import { UserRepository } from "../repositories/implements/userRepository";


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


export default router;