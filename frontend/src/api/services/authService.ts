import axiosInstance from "../axiosInstance";
import { IsignupForm } from "../../types/auth";

export const signupUser = async (data: IsignupForm) => {
  try {
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const otpVerification = async (otp: string, email: string) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", {
      otp,
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//super admin login
export const loginSuperAdmin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/sudo-login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/verify-email", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (password: string, email: string) => {
  try {
    const response = await axiosInstance.patch("/auth/reset-password", {
      password,
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//function to logout user
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

//google sign in api call ===============================================
export const googleSignIn = async (token: string) => {
  try {
    const response = await axiosInstance.post("/auth/google", { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//resend OTP API CALL ==========================================================================
export const resendOTP = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//block user OTP API CALL ==========================================================================
export const handleblockCompany = async (email: string) => {
  try {
    const response = await axiosInstance.patch("/auth/block-company", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleBlockEmployee = async (email: string) => {
  try {
    const response = await axiosInstance.patch("/auth/block-employee", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordReq = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordReq = async (token:string,password:string) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password",{token,password});
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const changePassword = async (data : Record<string,string>) => {
  try {
    const response = await axiosInstance.patch("/auth/change-password",{data});
    return response.data
  } catch (error) {
    throw error;
  }
}
