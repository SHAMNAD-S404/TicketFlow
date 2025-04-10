import axiosInstance from "../axiosInstance";

//api call to fetch all messages from a chat
export const fetchAllMessages = async (ticketID : string) => {
    try {
        const response =  await axiosInstance.get(`/communication/get-message?ticketID=${ticketID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
} 