import axiosInstance from "../axiosInstance";

const BaseEndPoint = {
    CHAT  : `/communication/chat`,
    NOTIFICATIONS : `communication/notification`,
}

//api call to fetch all messages from a chat
export const fetchAllMessages = async (ticketID : string) => {
    try {
        const response =  await axiosInstance.get(`${BaseEndPoint.CHAT}/get-message?ticketID=${ticketID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
} 


//api call to fetch all rooms
export const fetchAllRooms = async (participantsId : string) => {
    try {
        const response = await axiosInstance.get(`${BaseEndPoint.CHAT}/get-all-rooms?participantsId=${participantsId}`);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const fetchUserNotification = async (userId : string,limit:number = 10) => {
    try {
        const response = await axiosInstance.get(`${BaseEndPoint.NOTIFICATIONS}/${userId}?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const markNotificationAsRead = async (notificationId : string) => {
    try {
        const response = await axiosInstance.patch(`${BaseEndPoint.NOTIFICATIONS}/${notificationId}/read`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAllNotificationAsRead = async (userId : string) => {
    try {
        const response = await axiosInstance.patch(`${BaseEndPoint.NOTIFICATIONS}/${userId}/read-all`);
        return response.data;
    } catch (error) {
        throw error
    }
}



