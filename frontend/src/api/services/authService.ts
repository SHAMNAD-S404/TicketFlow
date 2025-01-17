import axiosInstance from "../axiosInstance";
import { IsignupForm  } from "../../types/auth";

export const signupUser = async (data: IsignupForm) => {
  try {
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.error("Error during signup", error);
    throw error;
  }
};

export const otpVerification = async (otp:string,email:string) => {
  try {
      const response = await axiosInstance.post("/auth/verify-otp", {otp,email});
      return response.data;
  } catch (error) {
      console.error("Error during otp verification", error);
      throw error;
  }
}

export const loginUser = async (email:string,passwrod: string) => {
  try {
    const response = await axiosInstance.post("/auth/login",{email,passwrod});
    return response.data;
    
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
}

export const verifyEmail = async (email:string) => {
  try {
      const response = await axiosInstance.post("/auth/verify-email",{email});
      return response.data;
  } catch (error) {
    throw error;
  }
}


