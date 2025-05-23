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
  isBlock?: boolean;
}

export interface IGenerateUserTokenResponse extends basicResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IGetUserRoleResponse extends basicResponse {
  role?: string;
}

//============================== INTERFACE FOR AUTH SERVCIE ==============================================
export interface IAuthService {
  registerUser(data: RegisterUserDTO): Promise<basicResponse>;

  verifyOTP(email: string, otp: string): Promise<basicResponse>;

  verifyLogin(
    email: string,
    password: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
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

  verifyEmail(email: string): Promise<basicResponse>;

  updateUserPassword(email: string, password: string): Promise<basicResponse>;

  getUserRole(email: string): Promise<IGetUserRoleResponse>;

  getResendOTP(email: string): Promise<basicResponse>;

  verifyUser(
    email: string
  ): Promise<{ message: string; success: boolean; statusCode: number; accessToken?: string }>;

  updateUserBlockStatus(
    email: string
  ): Promise<{ message: string; success: boolean; statusCode: number; userDataPayload?: object }>;

  validateForgotPasswordReq(email: string): Promise<basicResponse>;

  handleResetPassword(token: string, password: string): Promise<basicResponse>;

  changePasswordService(data: IChangePassData): Promise<basicResponse>;

  updateDocumentService(
    searchQuery: Record<string, any>,
    updateQuery: Record<string, any>
  ): Promise<IUpdateOneDocResp>;

  extractGoogleToken(token: string): Promise<IGoogleTokenResponse>;

  checkIsActiveUser(email: string): Promise<IActiveUserResponse>;

  generateUserToken(userData: IUser): Promise<IGenerateUserTokenResponse>;
}
