import dotenv from 'dotenv';
dotenv.config();

export interface IRabbitMQConfig{
    url:string;
    notificationQueue:string;
    companyRPCQueue:string;
}

export const RabbitMQConfig:IRabbitMQConfig = {
    url:process.env.RABBITMQ_URL as string,
    notificationQueue:process.env.NOTIFICATION_QUEUE as string,
    companyRPCQueue: process.env.COMPANY_RPC_QUEUE as string,
}