import axiosInstance from "../axiosInstance";
import { DepartemntForm } from "../../components/company/departmentMenu/subMenu/CreateDepartment";
import { IEmployeeForm } from "../../types/IEmployeeForm";
import { EmployeeEditForm } from "../../components/employee/profileMenu/subMenu/EmployeeProfileEdit";
import { IcompanyEditForm } from "../../components/company/profileMenu/subMenu/ProfileEdit";
import { IDepartmentData } from "@/types/IDepartmentData";

//fetch user data from the company service.
export const fetchUserData = async () => {
  const response = await axiosInstance.get("/company/comp/get-user");
  return response.data;
};

export const fetchEmployeeData = async () => {
  const response = await axiosInstance.get("/company/emp/get-user");
  return response.data;
};

//create deaprtment
export const createDepartment = async (data: DepartemntForm) => {
  const response = await axiosInstance.post("/company/dept/add-department", data);
  return response.data;
};

export const fetchAllDepartemts = async () => {
  const response = await axiosInstance.get("/company/dept/get-departments");
  return response.data;
};

export const fetchAllDepartemtsDetails = async () => {
  const response = await axiosInstance.get("/company/dept/get-departments-data");
  return response.data;
};

export const createEmployee = async (employeeData: IEmployeeForm) => {
  const response = await axiosInstance.post("/company/emp/add-employee", employeeData);
  return response.data;
};

export const udpateEmployeeProfile = async (data: EmployeeEditForm) => {
  const response = await axiosInstance.patch("/company/emp/update-profile", data);
  return response.data;
};

export const updateCompanyProfile = async (data: IcompanyEditForm) => {
  const response = await axiosInstance.patch("/company/comp/update-profile", data);
  return response.data;
};

export const fetchAllCompanies = async (currentPage: number, sort: string, searchKey: string) => {
  const response = await axiosInstance.get(
    `/company/comp/get-all-companies?page=${currentPage}&sort=${sort}&searchKey=${searchKey}`
  );
  return response.data;
};

export const fetchAllEmployees = async (companyId: string, currentPage: number, sortBy: string, searchKey: string) => {
  const response = await axiosInstance.get(
    `/company/emp/get-all-employees?page=${currentPage}&sortBy=${sortBy}&searchKey=${searchKey}&companyId=${companyId}`
  );
  return response.data;
};

export const fetchAllDepartemtsWiseEmployees = async (
  companyId: string,
  departmentId: string,
  currentPage: number,
  sortBy: string,
  searchKey: string
) => {
  const response = await axiosInstance.get(
    `/company/emp/get-department-employee?companyId=${companyId}
      &departmentId=${departmentId}&currentPage=${currentPage}
      &sortBy=${sortBy}&searchKey=${searchKey}`
  );

  return response.data;
};

export const updateDepartmentInfo = async (data: Partial<IDepartmentData>) => {
  const response = await axiosInstance.patch("/company/dept/update-department", data);
  return response.data;
};

export const updateCompanyDp = async (data: FormData) => {
  const response = await axiosInstance.post("/company/comp/upload-dp", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateEmployeeDp = async (data: FormData) => {
  const response = await axiosInstance.post("/company/emp/upload-dp", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const fetchEmployeesByDepartment = async (id: string) => {
  const response = await axiosInstance.get(`/company/emp/get-employee-by-department?id=${id}`);
  return response.data;
};

export const fetchAllEmployeeWithLessTicket = async (id: string) => {
  const response = await axiosInstance.get(`/company/emp/get-employee-by-less-ticket?id=${id}`);
  return response.data;
};

// api call to change department of a employee
export const changeEmployeeDepartment = async (employeeId: string, departmentId: string, departmentName: string) => {
  const response = await axiosInstance.patch("/company/emp/change-department", {
    employeeId,
    departmentId,
    departmentName,
  });
  return response.data;
};

//api call to delete department
export const deleteDepartment = async (id: string) => {
  const response = await axiosInstance.delete(`/company/dept/delete-department?id=${id}`);
  return response.data;
};

//api call to fetch company subscription statics in the sudo subs management
export const fetchCompanySubStatics = async () => {
  const response = await axiosInstance.get("/company/comp/get-company-subs-statics");
  return response.data;
};
