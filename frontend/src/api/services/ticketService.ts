import { IUpdateReassignTicketData } from "@/components/company/Ticket/ReassignTicket";
import axiosInstance from "../axiosInstance";

export const createTicket = async (data: FormData) => {
  try {
    const response = await axiosInstance.post("/tickets/create-ticket", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editTicket = async (data:FormData) => {
  try {
      const response = await axiosInstance.patch("/tickets/edit-ticket",data,{
        headers : {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchAllTickets = async (currentPage: number, sortBy: string, searchQuery: string) => {
  try {
    const response = await axiosInstance.get(
      `/tickets/get-all-tickets?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchTicketsEmployeeWise = async (
  currentPage: number,
  employeeId: string,
  sortBy: string,
  searchQuery: string
) => {
  try {
    const response = await axiosInstance.get(
      `/tickets/get-ticket-employee-wise?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}&employeeId=${employeeId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMyTicketProgress = async (
  currentPage: number,
  employeeId: string,
  sortBy: string,
  searchQuery: string
) => {
  try {
    const response = await axiosInstance.get(
      `/tickets/get-myticket-progress?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}&employeeId=${employeeId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ticketReassign = async (data: IUpdateReassignTicketData) => {
  try {
    const response = await axiosInstance.patch("/tickets/ticket-reassign", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchOneTicket = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/tickets/get-ticket?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTicketStatus = async (id: string, status: string, ticketResolutions?: string) => {
  try {
    const response = await axiosInstance.patch("/tickets/update-status", { id, status, ticketResolutions });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reOpenTicket = async (id:string,reason : string) => {
  try {
    const response = await axiosInstance.patch("/tickets/re-open-ticket",{id,reason});
    return response.data;
  } catch (error) {
    throw error
  }
}
