import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitMQConfig";

let channel: amqplib.Channel;
let connection: amqplib.Connection;

export const connectRabbitMQ = async (): Promise<amqplib.Channel> => {
  let attempts = 0;
  const maxAttempts = 7;
  const retryDelay = 5000;

  while (attempts < maxAttempts) {
    try {
      if (!channel) {
        connection = await amqplib.connect(RabbitMQConfig.URL);
        channel = await connection.createChannel();
        console.log("🐇 Connected to RabbitMQ!");
      }
      return channel;
    } catch (error) {
      attempts++;
      console.error(
        `Attempt ${attempts}: Failed to connect to RabbitMQ. Retrying in ${retryDelay / 1000}s...`
      );
      await new Promise((res) => setTimeout(res, retryDelay));
    }
  }

  throw new Error("❌ Failed to connect to RabbitMQ after multiple attempts.");
};

export { channel, connection };
