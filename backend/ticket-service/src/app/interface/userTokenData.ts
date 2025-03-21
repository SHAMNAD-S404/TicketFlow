export interface UserData {
    role : string,
    authUserUUID: string
    email : string;
}

export interface ITicketReassignData {
    ticketId : string;
    selectedDepartmentId : string;
    selectedDepartmentName : string;
    selectedEmployeeId : string;
    selectedEmployeeName : string;
    selectedEmployeeEmail : string
}

export interface IBasicResponse{
    message:string,
    statusCode : number,
    success : boolean
}
