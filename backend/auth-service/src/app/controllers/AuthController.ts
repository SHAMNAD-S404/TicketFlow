import { Request, Response } from "express";
import { IAuthService } from "../interfaces/IAuthService";
import { IAuthController } from "../interfaces/IAuthController";

export class AuthController implements IAuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  public registerUser = async(req: Request, res: Response): Promise<void> => {
    try {

      const registerData = req.body;
      delete registerData.confirmPassword;
      const response = await this.authService.registerUser(registerData);
      const { message, success } = response;
      const statusCode = success ? 201 : 400;

      console.log(response);
      res.status(statusCode).json({ message,success });

    } catch (error) {
      res.status(400).json({ message:String(error), success:false });
    }
  }

  public verifyOTP = async(req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp} = req.body;
      const response = await this.authService.verifyOTP(email,otp);
      const { message, success } = response;
      const statusCode = success ? 200 : 400;

      res.status(statusCode).json({message,success})
      
    } catch (error) {
      res.status(400).json({message:String(error),success:false});
    }

    
    
  }
}
