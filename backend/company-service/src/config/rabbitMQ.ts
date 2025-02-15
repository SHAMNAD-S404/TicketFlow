import dotenv from "dotenv";
dotenv.config();


export interface IRabbitMQConfig {
    url : string
    compnayRPCQueue: string;
    authConsumerQueue : string;
    companyMainQueue : string;
 }

 export const RabbitMQConfig : IRabbitMQConfig = {
    url : process.env.RABBITMQ_URL as string,
    compnayRPCQueue : process.env.COMPANY_RPC_QUEUE as string,
    authConsumerQueue : process.env.AUTH_CONSUMER_QUEUE as string,
    companyMainQueue :   process.env.COMPNAY_MAIN_QUEUE as string,
    
 }