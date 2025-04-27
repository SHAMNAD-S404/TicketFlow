import { sendUserNotification } from "../../socket";


export interface INotificationData {
    type : string;
    eventType : string;
    userId : string;
    ticketId : string;
    title : string;
    message : string;
}


export const sendNotification  = async (data : INotificationData) => {
    try {
        const {message,ticketId,title,type,userId} = data;
        const response = await sendUserNotification(userId,{
            type,
            title,
            message,
            relatedId : ticketId
        });
        console.log("response from send notificatoin ",response);
    } catch (error) {
        console.error("Error in sendNotificatoin to user : ",error);
    }
}