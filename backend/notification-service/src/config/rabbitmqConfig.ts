import dotev from "dotenv"
dotev.config();

export interface IRabbitMQConfig {
  url: string;
  notificationQueue: string;
}

// configs for rabbitmq
export const RabbitMQConfig: IRabbitMQConfig = {
  url: process.env.RABBITMQ_URL as string,
  notificationQueue: process.env.NOTIFICATION_QUEUE as string,
};
