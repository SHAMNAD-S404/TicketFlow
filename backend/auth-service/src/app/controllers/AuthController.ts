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

      console.log("hiiiii im inside controll")
      const registerData = req.body;
      delete registerData.confirmPassword;
      const message = await this.authService.registerUser(registerData);

      console.log(message);
      res.status(201).json({ message });

    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
