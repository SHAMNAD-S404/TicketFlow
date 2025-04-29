import { Request, Response } from "express";
import { IAuthService } from "../../services/interface/IAuthService";
import { IAuthController } from "../interface/IAuthController";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { EventType } from "../../../constants/queueEventType";
import { publishToQueue } from "../../../queues/publisher";
import { RabbitMQConfig } from "../../../config/rabbitmq";
import { validateEmailSchema } from "../../dtos/basicValidation.schema";
import { changePasswordSchema, resetPasswordSchema } from "../../dtos/baseFormValidation.schema";
import { setRedisData } from "../../../utils/redisUtils";

export class AuthController implements IAuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  //create user ================================================================================

  public registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData = req.body;
      // Remove confirmPassword from the req.body
      delete registerData.confirmPassword;
      const response = await this.authService.registerUser(registerData);
      const { message, success } = response;
      const statusCode = success ? 201 : 400;

      res.status(statusCode).json({ message, success });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //verify otp =====================================================================================

  public verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract the email and OTP from the request body
      const { email, otp } = req.body;

      // Call the verify OTP method of the Auth service
      const response = await this.authService.verifyOTP(email, otp);

      // Extract the message and success status from the response
      const { message, success } = response;

      // Set the status code based on the success status
      const statusCode = success ? 200 : 400;

      // Return the response with the message and success status
      res.status(statusCode).json({ message, success });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //verify login ==============================================================================

  public verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract the email and password from the request body

      const { email, password } = req.body;

      // Call the verifyLogin method of the Auth service
      const response = await this.authService.verifyLogin(email, password);

      // Check if the login was successful
      if (!response.success) {
        // Return a 401 status with an error message if the login fails
        res.status(401).json({ message: response.message, success: false });
        return;
      }

      const { message, success, tockens, isFirst, role } = response;

      if (role === "sudo") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      // Check if the tokens are present
      if (tockens) {
        const { accessToken, refreshToken } = tockens;

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 30 * 60 * 1000,
          sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 2 * 24 * 60 * 60 * 1000,
          sameSite: "lax",
        });

        // Return a 200 status with the message, success status and isFirst
        res.status(200).json({ message, success, isFirst, role });
        return;
      } else {
        // Return a 500 status with an error message if the tokens are not present
        res.status(500).json({ message: "failed to assign tokens", success: false });
        return;
      }
    } catch (error) {
      // Catch any errors and return a 400 status with an error message
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //verify email ===================================================================================

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Enter the email", success: false });
        return;
      }

      // Call the verifyEmail method of the Auth service
      const response = await this.authService.verifyEmail(email.toLowerCase());
      // Extract the message and success status from the response
      const { message, success } = response;

      // Check if the response was successful
      const statusCode = success ? 200 : 400;
      // Return the response with the appropriate status code
      res.status(statusCode).json({ message, success });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  // update password =========================================================================================

  public updateUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("im inside controlere");

      const { password, email } = req.body;
      if (!email && !password) {
        console.log("req.body", req.body);

        res.status(400).json({
          message: "user id or password is missing !",
          success: false,
        });
        return;
      }

      const updatePassword = await this.authService.updateUserPassword(email as string, password);
      const { message, success } = updatePassword;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({ message, success });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //fetch user role =====================================================================================

  public fetchUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const userEmail = req.query.email;
      if (!userEmail) {
        res.status(400).json({ message: "user detail not found", success: false });
        return;
      }

      const getRole = await this.authService.getUserRole(userEmail as string);
      const { message, role, success } = getRole;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({ message, success, role });
      return;
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //logout==================================================================================================

  public logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
      
      //Get refresh token from the cookie
      const refreshToken = req.cookies?.refreshToken;
      //black list token
      if(refreshToken){
        //store it on redis with 48 hours of expiration time
        const key = `blacklist:token:${refreshToken}`;
        await setRedisData(key,{blacklisted:true},172800);
      }

      //clear cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.status(200).json({ success: true, message: "logout successfully!" });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //google sign in ===================================================================================================

  public googleSignIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.body.token;
      if (!token) {
        res.status(400).json({ message: "token missing", success: false });
        return;
      }

      const verifySignIn = await this.authService.verifyGoogleSignIn(token);
      const { message, email, success } = verifySignIn;
      res.status(200).json({ message, email, success });
      return;
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  // resend otp =============================================================================================================
  public resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.body.email;
      if (!email) {
        res.status(400).json({ success: false, message: "email id missing" });
        return;
      }
      const response = await this.authService.getResendOTP(email);
      const { success, message } = response;
      res.status(200).json({ success, message });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  // verify super admin login================================================================================================

  public verifySudoLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ALL_FILED_REQUIRED_ERR, succeess: false });
        return;
      }

      const response = await this.authService.verifySuperAdminLogin(email, password);
      if (!response.success) {
        res.status(response.statusCode).json({ message: response.message, success: response.success });
        return;
      }

      const { message, statusCode, success, role, tockens } = response;

      if (tockens) {
        // Extract the accessToken and refreshToken from the tokens
        const { accessToken, refreshToken } = tockens;

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 30 * 60 * 1000, //for 15 min
          sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 2 * 24 * 60 * 60 * 1000, //for 2 days
          sameSite: "lax",
        });

        res.status(statusCode).json({ message, success, role });
        return;
      } else {
        // Return a 500 status with an error message if the tokens are not present
        res.status(500).json({ message: "failed to assign tokens", success: false });
        return;
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: String(error) });
    }
  };

  // verify refrsh Toekn ================================================================================================

  public verifyRefreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.query;

      const response = await this.authService.verifyUser(String(email));
      const { message, success, statusCode, accessToken } = response;

      if (accessToken) {
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 30 * 60 * 1000,
          sameSite: "lax",
        });
      }

      res.status(statusCode).json({ message, success });
      return;
    } catch (error) {
      console.error("error in verifyRefreshToken", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  };

  // handle company block status refrsh Toekn ================================================================

  public handleCompanyBlockStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.query.role !== "sudo") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const { email } = req.body;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ messages: Messages.EMAIL_MISSING, success: false });
        return;
      }

      const updateCompany = await this.authService.updateUserBlockStatus(email);
      const { message, statusCode, success, userDataPayload } = updateCompany;


      //sending to company service queue
      if (success && userDataPayload) {
        await publishToQueue(RabbitMQConfig.companyMainConsumer, {
          ...userDataPayload,
          eventType: EventType.COMPANY_STATUS_UPDATE,
        });
      }

      res.status(statusCode).json({ message, success });
    } catch (error) {
      console.error("error in block company procedure", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
      return;
    }
  };

  public handleEmployeeBlockStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role } = req.query;
      const permittedRole = ["company", "departmentHead"];
      if (!permittedRole.includes(String(role))) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const email = req.body.email;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.EMAIL_MISSING, success: false });
        return;
      }

      const updateEmployee = await this.authService.updateUserBlockStatus(email);
      const { message, statusCode, success, userDataPayload } = updateEmployee;


      //sending to company service queue
      if (success && userDataPayload) {
        await publishToQueue(RabbitMQConfig.companyMainConsumer, {
          ...userDataPayload,
          eventType: EventType.EMPLOYEE_STATUS_UPDATE,
        });
      }
      res.status(statusCode).json({ message, success });
    } catch (error) {
      console.log("error in block company procedure : ", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };
  //forgot password handle =====================================================================================

  public forgotPasswordHandle = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateEmail = validateEmailSchema.safeParse(req.body);
      if (!validateEmail.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.EMAIL_INVALID, success: false });
        return;
      }

      const response = await this.authService.validateForgotPasswordReq(validateEmail.data.email);
      const { message, statusCode, success } = response;
      res.status(statusCode).json({ message, success });
    } catch (error) {
      console.error("error in forgot password :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.SERVER_ERROR,
        success: false,
      });
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateInput = resetPasswordSchema.safeParse(req.body);
      if (!validateInput.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INVALID_FIELDS,
          success: false,
        });
      } else {
        const { password, token } = validateInput.data;
        const response = await this.authService.handleResetPassword(token, password);
        const { message, statusCode, success } = response;
        res.status(statusCode).json({ message, success });
        return;
      }
    } catch (error) {
      console.log("error while resetPassword :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.SERVER_ERROR,
        success: false,
      });
    }
  };

  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateData = changePasswordSchema.safeParse(req.body.data);
      if (!validateData.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INPUT_INVALID_OR_MISSING_SOME_FIELD,
          success: false,
        });
        return;
      }

      const updatePassword = await this.authService.changePasswordService(validateData.data);
      const { message, statusCode, success } = updatePassword;
      res.status(statusCode).json({ message, success });
    } catch (error) {
      console.error("error while change Password", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR, success: false });
    }
  };
}
