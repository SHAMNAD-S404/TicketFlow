export interface IShiftReqContext {
    _id : string,
    ticketObjectId : string;
    ticketID : string;
    reason : string;
    ticketHandlingEmployeeName : string;
    ticketHandlingEmployeeId : string;
    ticketHandlingDepartmentName : string;
    ticketHandlingDepartmentId : string;
    createdAt : Date;
    updatedAt : Date;
}