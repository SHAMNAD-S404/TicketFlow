import { Request, Response } from "express";
import { IAuthService } from "../../services/interface/IAuthService";
import { IAuthController } from "../interface/IAuthController";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { EventType } from "../../../constants/queueEventType";
import { publishToQueue } from "../../../queues/publisher";
import { RabbitMQConfig } from "../../../config/rabbitmq";
import { validateEmailSchema } from "../../dtos/basicValidation.schema";
import { changePasswordSchema, registerUserDTOSchema, resetPasswordSchema } from "../../dtos/baseFormValidation.schema";
import { setRedisData } from "../../../utils/redisUtils";
import { IUser } from "../../models/interface/IUser";


/**
 * @class AuthController
 * @description Handles authentication-related requests by orchestrating interactions between the service layer and the client.
 */
export class AuthController implements IAuthController {
 /**
  * @type {IAuthService}
  * @description Instance of the authentication service responsible for business logic.
  * @param authService - The authentcication service dependency
  */
  private authService: IAuthService;
  constructor(authService: IAuthService) {
    this.authService = authService;
  }



  //======================================  *CREATE USER*   ==========================================

  public registerUser = async (req: Request, res: Response): Promise<void> => {
    try {

      const registerData = req.body;
      // validating input using ZOD
      const validateInput = registerUserDTOSchema.safeParse(req.body);
      // return if input data is incorrect
      if(!validateInput.success){
        res.status(HttpStatus.BAD_REQUEST)
        .json({message:Messages.ALL_FILED_REQUIRED_ERR,success:false});
        return;
      } 
      // Remove confirmPassword from the req.body
      delete registerData.confirmPassword;  
      // Delegate user creation to the service layer
      const response = await this.authService.registerUser(registerData);
      const {message,statusCode,success} = response;
      res.status(statusCode).json({message,success});

    } catch (error) {
      console.error("error in register user",error);
      res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

  //==================================== *VERIFY OTP* ===================================================

  public verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {

      const { email, otp } = req.body;
      // Delegate verify otp to the service layer
      const response = await this.authService.verifyOTP(email, otp);
      const {message,statusCode,success} = response;
      res.status(statusCode).json({message,success});

    } catch (error) {

      console.error("error in verify otp",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

  // ================================ *VERIFY LOGIN*   ======================================================

  public verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {

      const { email, password } = req.body;
      // Delegate verify login to the service layer
      const response = await this.authService.verifyLogin(email, password);
      const {message,statusCode,success,isFirst,role,tockens} = response;

      // Check if the login was successful
      if (!success) {
         res.status(statusCode).json({message,success});
         return;
      }
      // AUTHORIZATION CHECKING
      if (role === "sudo") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      // Check if the tokens are present
      if (tockens) {
        const { accessToken, refreshToken } = tockens;
        //Assign tokens in cookies
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

        // Return response
        res.status(statusCode).json({ message, success, isFirst, role });
      }
    } catch (error) {

      console.error("error in verify login",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

  // ================================= *VERIFY EMAIL*  =====================================================

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const { email } = req.body;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).
        json({ message: Messages.EMAIL_MISSING, success: false });
        return;
      }

      // Delegation to auth service layer for verify email
      const response = await this.authService.verifyEmail(email.toLowerCase());
      const {message,statusCode,success} = response;
      res.status(statusCode).json({message,success});

    } catch (error) {

      console.error("error in verify email",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

  //================================= UPDATE PASSWORD  ==========================================================

  public updateUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {

      const { password, email } = req.body;
      if (!email && !password) {
        res.status(HttpStatus.BAD_REQUEST)
        .json({message: Messages.ALL_FILED_REQUIRED_ERR,success: false});
        return;
      }
      // Delegating upate password to the auth service layer.
      const updatePassword = await this.authService.updateUserPassword(email as string, password);
      const {message,statusCode,success} = updatePassword;
      res.status(statusCode).json({message,success})

    } catch (error) {

      console.error("error in update user password ",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false}); 
    }
  };

  //============================ * FETCH USER ROLE * =========================================================

  public fetchUserRole = async (req: Request, res: Response): Promise<void> => {
    try {

      const userEmail = req.query.email;
      if (!userEmail) {
        res.status(HttpStatus.BAD_REQUEST)
        .json({ message: Messages.ALL_FILED_REQUIRED_ERR, success: false });
        return;
      }
      // delegating get role function to auth service layer
      const getRole = await this.authService.getUserRole(userEmail as string);
      const { message, role, success,statusCode } = getRole;
      res.status(statusCode).json({ message, success, role });

    } catch (error) {

      console.error("error in fetch user role ",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false}); 
    }
  };

  //============================= LOGOUT USER =====================================================================

  public logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {

      //Get refresh token from the cookie
      const refreshToken = req.cookies?.refreshToken;
      //black list token for security purpose
      if (refreshToken) {
        //store it on redis with 48 hours of expiration time to prevent unintended access
        const key = `blacklist:token:${refreshToken}`;
        await setRedisData(key, { blacklisted: true }, 172800);
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

      res.status(HttpStatus.OK).json({ success: true, message: Messages.LOGOUT_SUCCESS});
    } catch (error) {

      console.error("error in logout user ",error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false}); 
    }
  };

  //=========================================== GOOGLE SIGN UP ========================================================

  public googleSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
      // google token from req body
      const token = req.body.token;
      if (!token) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.TOKEN_NOT_FOUND, success: false });
        return;
      }
      // verify and extract user email from the token
      const getEmail = await this.authService.extractGoogleToken(token);

      if (!getEmail.success) {
        const { message, statusCode, success } = getEmail;
        res.status(statusCode).json({ message, success });
        return;
      }

      // Checking for user is exist and active
      const isUserActive = await this.authService.checkIsActiveUser(getEmail.email as string);
      if (isUserActive.isBlock) {
        const { message, statusCode, success } = isUserActive;
        res.status(statusCode).json({ message, success });
        return;
      }

      //if user with email id exist! generate tokens and  navigate to dashboard
      if (isUserActive.userData) {

        const getTokens = await this.authService.generateUserToken(isUserActive.userData as IUser);
        const { accessToken, message, refreshToken, statusCode, success } = getTokens;

        //assign tokens to cookies
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

        res.status(statusCode).json({ message, success, isExistingUser: true });
        return;
      };

      // If its a new user store email on redis
      await setRedisData(`tempEmail:${getEmail.email}`, getEmail.email, 1200);
      res.status(HttpStatus.OK).json({
        message: Messages.EMAIL_STORED_AND_CONTINUE,
        success: true,
      });

    } catch (error) {
      console.error("error in google sign up ",error);
      res
         .status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

  //==================================== RESEND OTP METHOD ================================================================

  public resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.body.email;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: Messages.EMAIL_MISSING});
        return;
      }
      // Delegating resent otp to service layer
      const response = await this.authService.getResendOTP(email);
      const { success, message,statusCode } = response;
      res.status(statusCode).json({ success, message });

    } catch (error) {
      console.error("error in resend otp ",error);
      res
         .status(HttpStatus.INTERNAL_SERVER_ERROR)   
         .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

  //======================= VERIFY SUPER ADMIN LOGIN METHOD =================================================================

  public verifySudoLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.ALL_FILED_REQUIRED_ERR, succeess: false });
        return;
      }

      const response = await this.authService.verifySuperAdminLogin(email, password);
      if (!response.success) {
        res
          .status(response.statusCode)
          .json({ message: response.message, success: response.success });
        return;
      }

      const { message, statusCode, success, role, tockens } = response;

      if (tockens) {
        // Extract the accessToken and refreshToken from the tokens
        const { accessToken, refreshToken } = tockens;
        // Assign tokens in cookies
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 30 * 60 * 1000, //for 30 min
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
      } 
    } catch (error) {
        console.error("error in verify sudo login ",error);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)   
          .json({message:Messages.SERVER_ERROR,success:false});
    }
  };

  //============================ VERIFY REFRESH TOKEN ===============================================================

  public verifyRefreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      // email get from the refresh token, its sure always we get the email for this method
      const { email } = req.query;
      // Delegating verify user to service layer.
      const response = await this.authService.verifyUser(String(email));
      const { message, success, statusCode, accessToken } = response;

      // assigning access token in cookies
      if (accessToken) {
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 30 * 60 * 1000,
          sameSite: "lax",
        });
      }

      res.status(statusCode).json({ message, success });

    } catch (error) {
        console.error("error in verifyRefreshToken", error);
        res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR });
    }
  };

  //========================== GOOGLE SIGN IN METHOD =================================================================

  public googleSignIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.body.token;
      if (!token) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.TOKEN_NOT_FOUND, success: false });
        return;
      };

      //verify and extract user email from the token
      const getEmail = await this.authService.extractGoogleToken(token);
      if (!getEmail.success) {
        const { message, statusCode, success } = getEmail;
        res.status(statusCode).json({ message, success });
        return;
      }

      //Checking for user is exist and active
      const isUserActive = await this.authService.checkIsActiveUser(getEmail.email as string);
      if (!isUserActive.success) {
        const { message, statusCode, success } = isUserActive;
        res.status(statusCode).json({ message, success });
        return;
      }

      //if user with email id exist! generate tokens and  navigate to dashboard
      const getTokens = await this.authService.generateUserToken(isUserActive.userData as IUser);
      const { accessToken, message, refreshToken, statusCode, success } = getTokens;

      //assign tokens to cookies
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

      res.status(statusCode).json({ message, success });
    } catch (error) {

      console.error("error in google sign in", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  };

  //====================== HANDLE COMPANY BLOCK STATUS =========================================================

  public handleCompanyBlockStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      // Only super admin have the permission to block the companies
      if (req.query.role !== "sudo") {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const { email } = req.body;
      if (!email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ messages: Messages.EMAIL_MISSING, success: false });
        return;
      }

      // delegatin to the service layer for updating the company status
      const updateCompany = await this.authService.updateUserBlockStatus(email);
      const { message, statusCode, success, userDataPayload } = updateCompany;

      /**
       * sending the payload data with event
       * its update the company status in the company service
       */
      if (success && userDataPayload) {
        await publishToQueue(RabbitMQConfig.companyMainConsumer, {
          ...userDataPayload,
          eventType: EventType.COMPANY_STATUS_UPDATE,
        });
      }

      res.status(statusCode).json({ message, success });
    } catch (error) {
      console.error("error in block company procedure", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//====================== HANDLE EMPLOYEE BLOCK STATUS =========================================================

  public handleEmployeeBlockStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role } = req.query;
      const permittedRole = ["company", "departmentHead"];
      // Only permitted roles can block a employee and change status
      if (!permittedRole.includes(String(role))) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.NO_ACCESS, success: false });
        return;
      }

      const email = req.body.email;
      if (!email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.EMAIL_MISSING, success: false });
        return;
      }

      // Delegating to service layer for update user block status
      const updateEmployee = await this.authService.updateUserBlockStatus(email);
      const { message, statusCode, success, userDataPayload } = updateEmployee;

      
      /**
       * sending the payload data with event
       * its update the employee status in the company service
       */
      if (success && userDataPayload) {
        await publishToQueue(RabbitMQConfig.companyMainConsumer, {
          ...userDataPayload,
          eventType: EventType.EMPLOYEE_STATUS_UPDATE,
        });
      }
      res.status(statusCode).json({ message, success });
    } catch (error) {

      console.log("error in block company procedure : ", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

//====================== FORGOT PASSWORD HANDLE =================================================================

  public forgotPasswordHandle = async (req: Request, res: Response): Promise<void> => {
    try {

      // Validation input data with zod validation
      const validateEmail = validateEmailSchema.safeParse(req.body);
      if (!validateEmail.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.EMAIL_INVALID, success: false });
        return;
      }
      // delegation to the service layer for forgot password handle
      const response = await this.authService.validateForgotPasswordReq(validateEmail.data.email);
      const { message, statusCode, success } = response;
      res.status(statusCode).json({ message, success });

    } catch (error) {
      
      console.error("error in forgot password :", error);
      res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({message: Messages.SERVER_ERROR,success: false});
    }
  };

//====================== RESET PASSWORD HANDLE ====================================================================  

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      // Input validation using zod schema
      const validateInput = resetPasswordSchema.safeParse(req.body);

      if (!validateInput.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INVALID_FIELDS,
          success: false,
        });
        return;
      };
        const { password, token } = validateInput.data;
        // Delegating to the service layer for handle resetPasword
        const response = await this.authService.handleResetPassword(token, password);
        const { message, statusCode, success } = response;
        res.status(statusCode).json({ message, success });

    } catch (error) {

      console.log("error while resetPassword :", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.SERVER_ERROR,
        success: false,
      });
    }
  };

//====================== CHANGE PASSWORD METHOD ====================================================================  

  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      // validating Input data using zod schema
      const validateData = changePasswordSchema.safeParse(req.body.data);
      if (!validateData.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.INPUT_INVALID_OR_MISSING_SOME_FIELD,
          success: false,
        });
        return;
      }

      // Delegating to service layer for change password
      const updatePassword = await this.authService.changePasswordService(validateData.data);
      const { message, statusCode, success } = updatePassword;
      res.status(statusCode).json({ message, success });

    } catch (error) {

      console.error("error while change Password", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR, success: false });
    }
  };

  //===========================================================================================================================  

}
