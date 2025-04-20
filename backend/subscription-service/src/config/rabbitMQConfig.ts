import dotenv from "dotenv";
dotenv.config();


export  const RabbitMQConfig = {
    URL : process.env.RABBITMQ_URL  as string,
    COMPANY_QUEUE : process.env.COMPNAY_MAIN_QUEUE as string,
    AUTH_QUEUE : process.env.AUTH_CONSUMER_QUEUE as string,
}