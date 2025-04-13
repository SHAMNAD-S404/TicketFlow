import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitMQConfig";

let channel : amqplib.Channel;
let connection : amqplib.Connection;

export const connectRabbitMQ = async () : Promise<amqplib.Channel> => {
    try {

        if(!channel){
            connection = await amqplib.connect(RabbitMQConfig.URL);
            channel = await connection.createChannel();
        }
        return channel
        
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        throw new Error(`Failed to connect to RabbitMQ: ${error instanceof Error ? error.message : "Unknown error"}`); 
    }
}

export {channel , connection}