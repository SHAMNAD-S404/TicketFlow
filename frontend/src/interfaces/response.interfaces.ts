
export interface FetchAllTicketStaticReponse {
    success : boolean,
    status  : number,
    message : string,
    data: {
        totalTickets: number;
        openTickets: number;
        closedTickets: number;
        highPriorityTickets: number;
      };
}