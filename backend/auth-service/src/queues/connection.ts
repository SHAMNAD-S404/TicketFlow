import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitmq";

let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

// Setting up RabbitMQ
export const connectRabbitMQ = async (): Promise<void> => {
  try {
    if (!connection) {
      console.log("Establishing RabbitMQ connection...");
      connection = await amqplib.connect(RabbitMQConfig.url);

      connection.on("close", () => {
        console.error("RabbitMQ connection closed. Attempting to reconnect...");
        connection = null;
        setTimeout(connectRabbitMQ, 5000);
      });

      connection.on("error", (error) => {
        console.error("RabbitMQ connection error:", error);
        connection = null; // Reset connection reference
        setTimeout(connectRabbitMQ, 5000); // Retry connection after 5 seconds
      });
    }

    if (!channel) {
      console.log("Creating RabbitMQ channel...");
      channel = await connection.createChannel();

      channel.on("error", (error) => {
        console.error("RabbitMQ channel error:", error);
        channel = null;
      });

      channel.on("close", () => {
        console.error("RabbitMQ channel closed.");
        channel = null;
      });

      console.log("RabbitMQ channel successfully created.");
    }
  } catch (error) {
    console.error("Error initializing RabbitMQ:", error);
    connection = null;
    channel = null;
    setTimeout(connectRabbitMQ, 5000);
  }
};

export { channel, connection };
