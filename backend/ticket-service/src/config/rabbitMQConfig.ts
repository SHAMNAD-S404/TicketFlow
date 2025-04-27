import dotenv from 'dotenv';
dotenv.config();




export const RabbitMQConfig = {
    url : process.env.RABBITMQ_URL as string,
    notificationQueue : process.env.NOTIFICATION_QUEUE as string,
    companyMainQueue : process.env.COMPANY_MAIN_QUEUE as string,
    communicationServiceQueue : process.env.COMMUNICATION_SERVICE_QUEUE as string,
}