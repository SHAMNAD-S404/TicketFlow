export interface TicketStatusData {
    "pending": number;
    "in-progress": number;
    "re-opened": number;
  }


export interface ticketDepartmentCount {
   
      [department: string]: number;
    
  }

export interface LeaderBoardState{
    name : string,
    count : number
}