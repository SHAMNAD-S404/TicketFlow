import { RegisterUserDTO } from "../../dtos/registerUserDTO";

export interface IAuthService {
  registerUser(
    data: RegisterUserDTO
  ): Promise<{ message: string; success: boolean; statusCode: number }>;
  verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; success: boolean }>;
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
  updateUserPassword(
    email: string,
    password: string
  ): Promise<{ message: string; success: boolean }>;
  getUserRole(
    email: string
  ): Promise<{ message: string; success: boolean; role?: string }>;
  verifyGoogleSignIn(
    token: string
  ): Promise<{ message: string; success: boolean; email?: string }>;
  getResendOTP(email: string): Promise<{ message: string; success: boolean }>;
}
