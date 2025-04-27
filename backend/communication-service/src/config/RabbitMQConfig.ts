import dotev from "dotenv";
dotev.config();

export const RabbitMQConfig = {
    URL : process.env.RABBITMQ_URL as string,
    COMMUNICATION_QUEUE : process.env.COMMUNICATION_QUEUE as string,
}