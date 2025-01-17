import { Request, Response } from "express";
import { IAuthService } from "../../services/interface/IAuthService";
import { IAuthController } from "../interface/IAuthController";

export class AuthController implements IAuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  public registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData = req.body;
      delete registerData.confirmPassword;
      const response = await this.authService.registerUser(registerData);
      const { message, success } = response;
      const statusCode = success ? 201 : 400;

      console.log(response);
      res.status(statusCode).json({ message, success });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  public verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const response = await this.authService.verifyOTP(email, otp);
      const { message, success } = response;
      const statusCode = success ? 200 : 400;

      res.status(statusCode).json({ message, success });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  public verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, passwrod } = req.body;
      const response = await this.authService.verifyLogin(email, passwrod);

      if (!response.success) {
        res.status(401).json({ message: response.message, success: false });
        return;
      }

      const { message, success, tockens } = response;
      if (tockens) {
        const { accessToken, refreshToken } = tockens;
        console.log(
          "Accesstoken:- ",
          accessToken,
          "refreshtokens :-",
          refreshToken
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 90 * 60 * 1000, //for 90 min
          sameSite: "none",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 9 * 24 * 60 * 60 * 1000, //for 9 days
          sameSite: "none",
        });

        res.status(200).json({ message, success });
        return;
      } else {
        res
          .status(500)
          .json({ message: "failed to assign tokens", success: false });
        return;
      }
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("inside verify controller",req.body)
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Enter the email", success: false });
        return;
      }

      const response = await this.authService.verifyEmail( email.toLowerCase() );
      console.log("inside fverify emal controller resp:",response)
      const { message, success } = response;
      const statusCode = success ? 200 : 400;
      res.status(statusCode).json({ message, success });
    } catch (error) {
      res.status(400).json({ message: String(error), success: false });
    }
  };
}
