import {  Router  } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/authService";
import { UserRepository } from "../repositories/userRepository";


const router = Router();

// Dependency setup
const userRepository = new UserRepository(); 
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);


//Route
router.post("/signup",authController.registerUser)


export default router;