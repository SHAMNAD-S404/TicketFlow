import { IUpdateReassignTicketData } from "@/components/company/Ticket/ReassignTicket";
import axiosInstance from "../axiosInstance";
import { IPayloadShiftReq } from "@/components/common/ManageTicketHeader";
import axios from "axios";
import secrets from "@/config/secrets";

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text: string }[];
    };
  }[];
}

export const createTicket = async (data: FormData) => {
  const response = await axiosInstance.post("/tickets/create-ticket", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editTicket = async (data: FormData) => {
  const response = await axiosInstance.patch("/tickets/edit-ticket", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchAllTickets = async (currentPage: number, sortBy: string, searchQuery: string) => {
  const response = await axiosInstance.get(
    `/tickets/get-all-tickets?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}`
  );
  return response.data;
};

//api call to fetch all the shift req from db
export const fetchlAllShiftReq = async (currentPage: number, sortBy: string, searchQuery: string) => {
  const response = await axiosInstance.get(
    `/tickets/get-all-shift-req?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}`
  );
  return response.data;
};

export const fetchTicketsEmployeeWise = async (
  currentPage: number,
  employeeId: string,
  sortBy: string,
  searchQuery: string
) => {
  const response = await axiosInstance.get(
    `/tickets/get-ticket-employee-wise?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}&employeeId=${employeeId}`
  );
  return response.data;
};

export const fetchMyTicketProgress = async (
  currentPage: number,
  employeeId: string,
  sortBy: string,
  searchQuery: string
) => {
  const response = await axiosInstance.get(
    `/tickets/get-myticket-progress?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}&employeeId=${employeeId}`
  );
  return response.data;
};

export const ticketReassign = async (data: IUpdateReassignTicketData) => {
  const response = await axiosInstance.patch("/tickets/ticket-reassign", data);
  return response.data;
};

export const fetchOneTicket = async (id: string) => {
  const response = await axiosInstance.get(`/tickets/get-ticket?id=${id}`);
  return response.data;
};

export const updateTicketStatus = async (id: string, status: string, ticketResolutions?: string) => {
  const response = await axiosInstance.patch("/tickets/update-status", { id, status, ticketResolutions });
  return response.data;
};

export const reOpenTicket = async (id: string, reason: string) => {
  const response = await axiosInstance.patch("/tickets/re-open-ticket", { id, reason });
  return response.data;
};

//api call to ticket shift request made
export const ticketShiftRequest = async (data: IPayloadShiftReq) => {
  const response = await axiosInstance.post("/tickets/ticket-shift-request", { data });
  return response.data;
};

//api call to reject and delete shift req
export const rejectShiftRequest = async (id: string) => {
  const response = await axiosInstance.delete(`/tickets/reject-shift-req?id=${id}`);
  return response.data;
};

//api call for fetch all tickets statics
export const fetchAllTicketStatics = async () => {
  const response = await axiosInstance.get("/tickets/fetch-all-ticket-statics");
  return response.data;
};

//api call for fetch all my ticket progrss statics
export const fetchMyTicketStatics = async () => {
  const response = await axiosInstance.get("/tickets/fetch-my-ticket-statics");
  return response.data;
};

//for fetch get assigned tickets statics
export const fetchAssignedTicketStatics = async () => {
  const response = await axiosInstance.get("/tickets/fetch-assigned-ticket-statics");
  return response.data;
};

//for fetching ticket stats data for dashboard
export const fetchTicketCardStatsForDashboard = async () => {
  const response = await axiosInstance.get("/tickets/fetch-all-ticket-stats-dashboard");
  return response.data;
};

//for fetching ticket stats data for dashboard
export const fetchTicketCardStatsForEmployee = async () => {
  const response = await axiosInstance.get("/tickets/fetch-all-ticket-employee-dashboard");
  return response.data;
};

//for fetching the dashboard chart and graph data
export const fetchCompanyDashboardData = async () => {
  const response = await axiosInstance.get("/tickets/fetch-dashboard-data");
  return response.data;
};

//for fetching the dashboard chart and graph data
export const fetchEmployeeDashboardData = async () => {
  const response = await axiosInstance.get("/tickets/fetch-employee-dashbaord-data");
  return response.data;
};

//api call for the chat bot
export const Aichatbot = async (prompt: string) => {
  const response = await axios.post<GeminiResponse>(
    secrets.GEMINIAPIURL,
    {
      contents: [{ parts: [{ text: `User: ${prompt}\nBot:` }] }],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond.";
  return { success: true, data: reply };
};
