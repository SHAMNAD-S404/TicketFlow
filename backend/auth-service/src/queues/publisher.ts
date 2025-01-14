import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitmq";
import { channel, connection } from "./connection";

export const publishToQueue = async(queueName: string, message: object): Promise<void> => {
    try {
        if(!channel){
            throw new Error("Channel is not available");
        }     
        await channel.assertQueue(RabbitMQConfig.notificationQueue, {durable: true});

        //send message to the queue
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {persistent: true});

        console.log(`message sent to ${queueName} queue`);
        
        if (channel && connection) {
            await channel.close();
            await connection.close();
        }
        
    } catch (error) {
        console.error("Error in publishing the message", error);
    }
} 