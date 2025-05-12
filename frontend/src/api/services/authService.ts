import axiosInstance from "../axiosInstance";
import { IsignupForm } from "../../types/auth";

export const signupUser = async (data: IsignupForm) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const otpVerification = async (otp: string, email: string) => {
  const response = await axiosInstance.post("/auth/verify-otp", {
    otp,
    email,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

//super admin login
export const loginSuperAdmin = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/sudo-login", { email, password });
  return response.data;
};

export const verifyEmail = async (email: string) => {
  const response = await axiosInstance.post("/auth/verify-email", { email });
  return response.data;
};

export const resetPassword = async (password: string, email: string) => {
  const response = await axiosInstance.patch("/auth/reset-password", {
    password,
    email,
  });
  return response.data;
};

//function to logout user
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

//google sign in api call ===============================================
export const googleSignIn = async (token: string) => {
  const response = await axiosInstance.post("/auth/google", { token });
  return response.data;
};

//google login api call 
export const googleLoginAPI = async (token : string) => {
  const response = await axiosInstance.post("/auth/google-sign-in",{ token});
  return response.data;
}

//resend OTP API CALL ==========================================================================
export const resendOTP = async (email: string) => {
  const response = await axiosInstance.post("/auth/resend-otp", { email });
  return response.data;
};

//block user OTP API CALL ==========================================================================
export const handleblockCompany = async (email: string) => {
  const response = await axiosInstance.patch("/auth/block-company", { email });
  return response.data;
};

export const handleBlockEmployee = async (email: string) => {
  const response = await axiosInstance.patch("/auth/block-employee", { email });
  return response.data;
};

export const forgotPasswordReq = async (email: string) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordReq = async (token: string, password: string) => {
  const response = await axiosInstance.post("/auth/reset-password", { token, password });
  return response.data;
};

export const changePassword = async (data: Record<string, string>) => {
  const response = await axiosInstance.patch("/auth/change-password", { data });
  return response.data;
};
