import dotenv from "dotenv";
dotenv.config();


export interface IRabbitMQConfig {
    url : string
    compnayRPCQueue: string
 }

 export const RabbitMQConfig : IRabbitMQConfig = {
    url : process.env.RABBITMQ_URL as string,
    compnayRPCQueue : process.env.COMPANY_RPC_QUEUE as string
 }