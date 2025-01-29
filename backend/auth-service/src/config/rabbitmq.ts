import dotenv from 'dotenv';
dotenv.config();

export interface IRabbitMQConfig{
    url:string;
    notificationQueue:string;
    companyRPCQueue:string;
    authConsumerQueue : string;
}

export const RabbitMQConfig:IRabbitMQConfig = {
    url:process.env.RABBITMQ_URL as string,
    notificationQueue:process.env.NOTIFICATION_QUEUE as string,
    companyRPCQueue: process.env.COMPANY_RPC_QUEUE as string,
    authConsumerQueue : process.env.AUTH_CONSUMER_QUEUE as string,
}