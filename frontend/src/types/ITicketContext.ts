export interface ITicketContext {
    _id : string;
    ticketID: string;
    authUserUUID: string;
    ticketReason: string;
    description: string;
    priority: string;
    dueDate: string;
    supportType: string;
    status: string;
    imageUrl: string;
    ticketHandlingDepartmentId: string;
    ticketHandlingDepartmentName: string;
    ticketHandlingEmployeeId: string;
    ticketHandlingEmployeeName: string;
    ticketRaisedEmployeeId: string;
    ticketRaisedEmployeeName: string;
    ticketRaisedDepartmentName: string;
    ticketRaisedDepartmentId: string;
    createdAt : Date;
    updatedAt : Date;
}