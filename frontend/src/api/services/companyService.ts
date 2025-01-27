import axiosInstance from "../axiosInstance";
import { DepartemntForm } from "../../components/dahsboard/menu/departmentMenu/subMenu/CreateDepartment";


//fetch user data from the company service.
export const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/company/comp/get-user");
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  //create deaprtment 
  export const createDepartment = async (data :DepartemntForm ) => {
    try {
      const response = await axiosInstance.post("/company/dept/add-department",data);
      return response.data;
    } catch (error) {
      console.log("Error during create department ",error);
      throw error;
    }
  }