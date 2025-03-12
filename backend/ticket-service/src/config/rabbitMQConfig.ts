import dotenv from 'dotenv';
dotenv.config();

export interface IRabbitMQConfig{
    url : string;
    notificationQueue:string;
    companyMainQueue:string;
}


export const RabbitMQConfig : IRabbitMQConfig = {
    url : process.env.RABBITMQ_URL as string,
    notificationQueue : process.env.NOTIFICATION_QUEUE as string,
    companyMainQueue : process.env.COMPANY_MAIN_QUEUE as string,
}