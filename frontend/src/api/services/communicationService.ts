import axiosInstance from "../axiosInstance";

const BaseEndPoint = {
  CHAT: `/communication/chat`,
  NOTIFICATIONS: `communication/notification`,
};

//api call to fetch all messages from a chat
export const fetchAllMessages = async (ticketID: string) => {
  const response = await axiosInstance.get(`${BaseEndPoint.CHAT}/get-message?ticketID=${ticketID}`);
  return response.data;
};

//api call to fetch all rooms
export const fetchAllRooms = async (participantsId: string) => {
  const response = await axiosInstance.get(`${BaseEndPoint.CHAT}/get-all-rooms?participantsId=${participantsId}`);
  return response.data;
};

export const fetchUserNotification = async (userId: string, limit: number = 10) => {
  const response = await axiosInstance.get(`${BaseEndPoint.NOTIFICATIONS}/${userId}?limit=${limit}`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await axiosInstance.patch(`${BaseEndPoint.NOTIFICATIONS}/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationAsRead = async (userId: string) => {
  const response = await axiosInstance.patch(`${BaseEndPoint.NOTIFICATIONS}/${userId}/read-all`);
  return response.data;
};
