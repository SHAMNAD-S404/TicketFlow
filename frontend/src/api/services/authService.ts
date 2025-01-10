import axiosInstance from "../axiosInstance";
import { IsignupForm } from "../../types/auth";

export const signupUser = async (data: IsignupForm) => {
  try {
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.error("Error during signup", error);
    throw error;
  }
};
