import dotenv from "dotenv";
dotenv.config();


export  const RabbitMQConfig = {
    URL : process.env.RABBITMQ_URL  as string,
    
}