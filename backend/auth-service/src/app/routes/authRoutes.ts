import {  Router , Request, Response  } from "express";
import { AuthController } from "../controllers/implementations/AuthController";
import { AuthService } from "../services/implementations/authService";
import { UserRepository } from "../repositories/implements/userRepository";
import { authenticateToken } from "../middlewares/authenticateToken";
import { extractUserData } from "../middlewares/extractUserData";
import { verifyRefreshToken } from "../middlewares/authenticateRefreshToken";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";


const router = Router();

// Creating instance of classes with depedencies
const userRepository = new UserRepository(); 
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);


//Routes Mapping
router.post ("/signup",authController.registerUser)
      .post ("/verify-otp",authController.verifyOTP)
      .post ("/login",authController.verifyLogin)
      .post ("/sudo-login",authController.verifySudoLogin)
      .post ("/verify-email",authController.verifyEmail)
      .patch("/reset-password",authenticateToken,authController.updateUserPassword)
      .get  ("/get-user-role",authenticateToken,extractUserData,authController.fetchUserRole)
      .post ("/logout",authenticateToken,extractUserData,authController.logoutUser)
      .post ("/google",authController.googleSignUp)
      .post ("/google-sign-in",authController.googleSignIn)
      .post ("/resend-otp",authController.resendOtp)
      .post ("/refreshToken",verifyRefreshToken,extractUserData,authController.verifyRefreshToken)
      .patch("/block-company",authenticateToken,extractUserData,authController.handleCompanyBlockStatus)
      .patch("/block-employee",authenticateToken,extractUserData,authController.handleEmployeeBlockStatus)
      .post ('/forgot-password',authController.forgotPasswordHandle)
      .post ("/reset-password",authController.resetPassword)
      .patch("/change-password",authenticateToken,authController.changePassword)


// Catch all for unknown routes
router.use("*",(req : Request, res : Response) => {
      res.status(HttpStatus.NOT_FOUND).json({
        message : Messages.ROUTE_WILD_CARD_MESSAGE,
        success : false,
      });
});


export default router;