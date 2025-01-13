import dotenv from 'dotenv';
dotenv.config();

export interface IRabbitMQConfig{
    url:string;
    notificationQueue:string;
}

export const RabbitMQConfig:IRabbitMQConfig = {
    url:process.env.RABBITMQ_URL as string,
    notificationQueue:process.env.NOTIFICATION_QUEUE as string
}