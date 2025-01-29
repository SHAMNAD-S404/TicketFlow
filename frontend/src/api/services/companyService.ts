import axiosInstance from "../axiosInstance";
import { DepartemntForm } from "../../components/dahsboard/menu/departmentMenu/subMenu/CreateDepartment";
import { IEmployeeForm } from "../../types/IEmployeeForm";
import { data } from "react-router-dom";

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

  export const fetchAllDepartemts = async() => {
    try {
      const response = await axiosInstance.get("/company/dept/get-departments")
      return response.data;
    } catch (error) {
      console.log("Error during fetch departments",error);
      throw error;
      
    }
  }

  export const createEmployee = async (employeeData : IEmployeeForm) => {
    try {

      const response = await axiosInstance.post("/company/emp/add-employee",employeeData);
      return response.data;
        
    } catch (error) {
      console.log("Error during fetch departments",error);
      throw error;
    }
  }