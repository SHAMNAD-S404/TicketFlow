import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitmq";

export const publishToQueue = async(queueName:string,message:object) : Promise<void> => {
    try {
        const connection = await amqplib.connect(RabbitMQConfig.url);
        const channel = await connection.createChannel();
        await channel.assertQueue(RabbitMQConfig.notificationQueue,{durable:true});

        //send message to the queue
        channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message)),{persistent:true});

        console.log(`message sended to  ${queueName} : queue`);
        await channel.close();
        await connection.close();
        
    } catch (error) {
        console.error("Error in publishing the message",error);
        
    }
} 