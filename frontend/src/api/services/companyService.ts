import axiosInstance from "../axiosInstance";

//fetch user data from the company service.
export const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/company/get-user");
      return response.data;
    } catch (error) {
      throw error;
    }
  }