import axiosInstance from "../axiosInstance";
import { DepartemntForm } from "../../components/company/departmentMenu/subMenu/CreateDepartment";
import { IEmployeeForm } from "../../types/IEmployeeForm";
import { EmployeeEditForm } from "../../components/employee/profileMenu/subMenu/EmployeeProfileEdit";
import { IcompanyEditForm } from "../../components/company/profileMenu/subMenu/ProfileEdit";
import { MessageConst } from "../../utils/constants/messageConstants";
//fetch user data from the company service.
export const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get("/company/comp/get-user");
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

export const fetchEmployeeData = async () => {
  try {
    const response = await axiosInstance.get("/company/emp/get-user");
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

//create deaprtment
export const createDepartment = async (data: DepartemntForm) => {
  try {
    const response = await axiosInstance.post(
      "/company/dept/add-department",
      data
    );
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

export const fetchAllDepartemts = async () => {
  try {
    const response = await axiosInstance.get("/company/dept/get-departments");
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

export const createEmployee = async (employeeData: IEmployeeForm) => {
  try {
    const response = await axiosInstance.post(
      "/company/emp/add-employee",
      employeeData
    );
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

export const udpateEmployeeProfile = async (data: EmployeeEditForm) => {
  try {
    const response = await axiosInstance.patch(
      "/company/emp/update-profile",
      data
    );
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

export const updateCompanyProfile = async (data: IcompanyEditForm) => {
  try {
    const response = await axiosInstance.patch(
      "/company/comp/update-profile",
      data
    );
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

export const fetchAllCompanies = async (
  currentPage: number,
  sort: string,
  searchKey: string
) => {
  try {
    const response = await axiosInstance.get(
      `/company/comp/get-all-companies?page=${currentPage}&sort=${sort}&searchKey=${searchKey}`
    );
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX, error);
    throw error;
  }
};

export const fetchAllEmployees = async (
  companyId: string,
  currentPage: number,
  sortBy: string,
  searchKey: string
) => {
  try {
    const response = await axiosInstance.get(
      `/company/emp/get-all-employees?page=${currentPage}&sortBy=${sortBy}&searchKey=${searchKey}&companyId=${companyId}`
    );
    return response.data;
  } catch (error) {
    console.log(MessageConst.FETCH_ERROR_AXIOX);
    throw error;
  }
};
