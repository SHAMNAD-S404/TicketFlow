import { RegisterUserDTO } from "../../dtos/registerUserDTO";
import { basicResponse } from "../../interfaces/basicResponse";
import { IUser } from "../../models/interface/IUser";

export interface IChangePassData {
  email: string;
  currentPassword: string;
  newPassword: string;
}
export interface IUpdateOneDocResp extends basicResponse {
  data?: any;
}
export interface IGoogleTokenResponse extends basicResponse {
  email?: string;
}
export interface IActiveUserResponse extends basicResponse {
  userData: IUser | null;
  isBlock? : boolean;
}

export interface IGenerateUserTokenResponse extends basicResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  registerUser(data: RegisterUserDTO): Promise<{ message: string; success: boolean; statusCode: number }>;

  verifyOTP(email: string, otp: string): Promise<{ message: string; success: boolean }>;

  verifyLogin(
    email: string,
    password: string
  ): Promise<{
    message: string;
    success: boolean;
    tockens?: { accessToken: string; refreshToken: string };
    isFirst?: boolean;
    role?: string;
  }>;

  verifySuperAdminLogin(
    email: string,
    password: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    tockens?: { accessToken: string; refreshToken: string };
    role?: string;
  }>;

  verifyEmail(email: string): Promise<{ message: string; success: boolean }>;

  updateUserPassword(email: string, password: string): Promise<{ message: string; success: boolean }>;

  getUserRole(email: string): Promise<{ message: string; success: boolean; role?: string }>;

  getResendOTP(email: string): Promise<{ message: string; success: boolean }>;

  verifyUser(email: string): Promise<{ message: string; success: boolean; statusCode: number; accessToken?: string }>;

  updateUserBlockStatus(
    email: string
  ): Promise<{ message: string; success: boolean; statusCode: number; userDataPayload?: object }>;

  validateForgotPasswordReq(email: string): Promise<basicResponse>;

  handleResetPassword(token: string, password: string): Promise<basicResponse>;

  changePasswordService(data: IChangePassData): Promise<basicResponse>;

  updateDocumentService(searchQuery: Record<string, any>, updateQuery: Record<string, any>): Promise<IUpdateOneDocResp>;

  extractGoogleToken(token: string): Promise<IGoogleTokenResponse>;

  checkIsActiveUser(email: string): Promise<IActiveUserResponse>;

  generateUserToken(userData: IUser): Promise<IGenerateUserTokenResponse>;
}
