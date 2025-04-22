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


//api call to fetch all rooms
export const fetchAllRooms = async (participantsId : string) => {
    try {
        const response = await axiosInstance.get(`/communication/get-all-rooms?participantsId=${participantsId}`);
        return response.data;
    } catch (error) {
        throw error
    }
}