import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitmqConfig";

let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

export const getRabbitMQChannel = async (): Promise<amqplib.Channel> => {
  if (channel) return channel;
  try {
    connection = await amqplib.connect(RabbitMQConfig.url);
    channel = await connection.createChannel();

    console.log("✅ RabbitMQ channel established");
    return channel;
  } catch (error) {
    console.error("Error in connecting to rabbitmq ", error);
    throw new Error("failed to create rabbitmq channel");
  }
};

export { connection, channel };
