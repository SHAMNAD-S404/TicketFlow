import { Request, Response } from "express";

export interface ITicketController {
  createTicket(req: Request, res: Response): Promise<void>;
  getAllTickets(req: Request, res: Response): Promise<void>;
  ticketReassign(req: Request, res: Response): Promise<void>;
  fetchTicket(req: Request, res: Response): Promise<void>;
  updateTicketStatus(req: Request, res: Response): Promise<void>;
  getTicketEmployeeWise(req: Request, res: Response): Promise<void>;
  getTicketEmployeeRaisedWise(req: Request, res: Response): Promise<void>;
  editTicket(req: Request, res: Response): Promise<void>;
  ticketReOpen(req: Request, res: Response): Promise<void>;
  fetchAllTicketStatics(req: Request, res: Response): Promise<void>;
  fetchMyTicketStatics(req: Request, res: Response): Promise<void>;
  fetchAssignedTicketStatics(req: Request, res: Response): Promise<void>;
  getTicketStatsForDashboard(req: Request, res: Response): Promise<void>;
  getTicketStatsForEmployee ( req : Request , res : Response ) : Promise<void>;
  getDashboardData (req : Request , res: Response) : Promise<void>;
  getEmployeeDashboardData (req : Request , res: Response) : Promise<void>;

  checkPriorityWise(req:Request,res:Response) : Promise<void>
}
