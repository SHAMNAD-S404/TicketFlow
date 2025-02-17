import EmployeeService from "../../app/services/implements/employeeService";

const employeeService = new EmployeeService();

export interface IEmployeeStatus {
  email: string;
  isBlock: boolean;
  eventType: string;
}

export const employeeStatusUpdate = async (data: IEmployeeStatus) => {
  try {  
    const updateEmployee = await employeeService.employeeStatusChange(
      data.email,
      data.isBlock
    );
    console.log(updateEmployee);
  } catch (error) {
    console.log("error while employeeHandler udpate : ", error);
  }
};
