import EmployeeService from "../../app/services/implements/employeeService";

const employeeService = new EmployeeService();

export interface IEmployeeStatus {
  email: string;
  isBlock: boolean;
  eventType: string;
}

interface IupdateEmployeeTicketStatus {
  eventType : string,
  employeeId : string,
  value : string
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

export const updateEmployeeTicketStatus = async (data : IupdateEmployeeTicketStatus) => {
  try {
    const updateTicket = await employeeService.updateTicketCount(data.employeeId,Number(data.value));
    console.log(updateTicket)
  } catch (error) {
    console.log("error while update employee ticket udpate : ", error);
  }
}
