import { Request, Response } from "express";
import { IAuthService } from "../../services/interface/IAuthService";
import { IAuthController } from "../interface/IAuthController";

export class AuthController implements IAuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  //create user ================================================================================

  /**
   * Registers a new user
   * @param req The request object
   * @param res The response object
   */
  public registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData = req.body;
      // Remove confirmPassword from the req.body
      delete registerData.confirmPassword;
      const response = await this.authService.registerUser(registerData);
      const { message, success } = response;
      const statusCode = success ? 201 : 400;

      // Log the response for debugging purposes
      console.log(response);
      res.status(statusCode).json({ message, success });
    } catch (error) {
      // Return a 400 status with an error message if the registration fails
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //verify otp =====================================================================================

  /**
   * Verifies the OTP sent to the user's email
   * @param req The request object
   * @param res The response object
   */
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
      // Catch any errors and return a 400 status with an error message
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //verify login ==============================================================================

  /**
   * Verifies the user's login credentials
   * @param req The request object
   * @param res The response object
   */
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

      // Extract the message, success status, tokens and isFirst from the response
      const { message, success, tockens, isFirst, role } = response;

      // Check if the tokens are present
      if (tockens) {
        // Extract the accessToken and refreshToken from the tokens
        const { accessToken, refreshToken } = tockens;

        // Set the accessToken and refreshToken cookies with the appropriate options
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 90 * 60 * 1000, //for 90 min
          sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 9 * 24 * 60 * 60 * 1000, //for 9 days
          sameSite: "lax",
        });

        // Return a 200 status with the message, success status and isFirst
        res.status(200).json({ message, success, isFirst, role });
        return;
      } else {
        // Return a 500 status with an error message if the tokens are not present
        res
          .status(500)
          .json({ message: "failed to assign tokens", success: false });
        return;
      }
    } catch (error) {
      // Catch any errors and return a 400 status with an error message
      res.status(400).json({ message: String(error), success: false });
    }
  };

  //verify email ===================================================================================

  /**
   * Verify email address by sending an OTP to the user
   * @param req The request object
   * @param res The response object
   */
  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract the email from the request body
      console.log("inside verify controller", req.body);
      const { email } = req.body;

      // Check if the email is provided
      if (!email) {
        // Return a 400 status with an error message if the email is not provided
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
      // Catch any errors and return a 400 status with an error message
      res.status(400).json({ message: String(error), success: false });
    }
  };

  // update password =========================================================================================

  public updateUserPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log("im inside controlere");

      const { password, email } = req.body;
      if (!email && !password) {
        console.log("req.body", req.body);

        res
          .status(400)
          .json({
            message: "user id or password is missing !",
            success: false,
          });
        return;
      }

      const updatePassword = await this.authService.updateUserPassword(
        email as string,
        password
      );
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
        res
          .status(400)
          .json({ message: "user detail not found", success: false });
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
      const authUserUUID = req.query.authUserUUID;
      if (!authUserUUID) {
        res
          .status(401)
          .json({ message: "user not authenticated", success: false });
        return;
      }

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
        if(!token){
          res.status(400).json({message:"token missing",success:false})
          return;
        }

        const verifySignIn = await this.authService.verifyGoogleSignIn(token)
        const {message,email,success} = verifySignIn;
        res.status(200).json({message,email,success});
        return;

    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  }

  // resend otp =============================================================================================================
    public resendOtp = async (req: Request, res: Response): Promise<void> => {
      try {
        const email = req.body.email;
        if(!email){
          res.status(400).json({success:false,message: "email id missing"})
          return;
        }
        const response = await this.authService.getResendOTP(email);
        const {success,message} = response;
        res.status(200).json({success,message});
        
      } catch (error) {
        res.status(400).json({ message: String(error), success: false });
      }
    }

}
