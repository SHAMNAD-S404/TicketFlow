import { Request, Response } from "express";

export interface IAuthController {
  registerUser(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  verifyLogin(req: Request, res: Response): Promise<void>;
  verifySudoLogin(req:Request ,res: Response) : Promise<void>;
  verifyEmail(req: Request, res: Response): Promise<void>;
  updateUserPassword(req: Request, res: Response): Promise<void>;
  fetchUserRole(req: Request, res: Response): Promise<void>;
  logoutUser(req: Request, res: Response): Promise<void>;
  googleSignIn(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  verifyRefreshToken ( req:Request,res:Response) : Promise<void>;
  handleCompanyBlockStatus ( req: Request , res : Response) : Promise<void>;
}
