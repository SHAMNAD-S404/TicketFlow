import { IUpdateReassignTicketData } from "@/components/company/Ticket/ReassignTicket";
import axiosInstance from "../axiosInstance";
import { IPayloadShiftReq } from "@/components/common/ManageTicketHeader";

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
    throw error;
  }
};


//api call to fetch all the shift req from db
export const fetchlAllShiftReq = async (currentPage : number , sortBy : string,searchQuery : string) => {
  try {
    const response = await axiosInstance.get(`/tickets/get-all-shift-req?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

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

//api call to ticket shift request made
export const ticketShiftRequest = async (data : IPayloadShiftReq) => {
  try {
    const response = await axiosInstance.post("/tickets/ticket-shift-request",{data});
    return response.data;
  } catch (error) {
    throw error;
  }
}

//api call to reject and delete shift req
export const rejectShiftRequest = async (id : string) => {
  try {
    const response = await axiosInstance.delete(`/tickets/reject-shift-req?id=${id}`);
    return response.data;
  } catch (error) {
    throw(error)
  }
}

//AIzaSyCzWaUzUy9fi3P9QbCphluInCI0V3o3PIo
export const Aichatbot = async (prompt : string) => {
  try {
    const response = await axiosInstance.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY`);
    return response.data;
  } catch (error) {
    throw(error)
  }
}

